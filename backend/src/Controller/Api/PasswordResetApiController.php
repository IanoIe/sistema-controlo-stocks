<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

#[Route('/api/password-reset', name: 'api_password_reset_')]
class PasswordResetApiController extends AbstractController
{
    public function __construct(
        private readonly ResetPasswordHelperInterface $resetPasswordHelper,
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator,
        private readonly LoggerInterface $securityLogger,
    ) {
    }

    /**
     * Request a password reset.
     */
    #[Route('/request', name: 'request', methods: ['POST'])]
    public function requestReset(
        Request $request,
        MailerInterface $mailer
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );

        if (!is_array($data) || !isset($data['email'])) {
            return $this->json([
                'success' => false,
                'error' => 'Email requis',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validate the email address.
        $constraint = new Assert\Collection([
            'email' => [
                new Assert\NotBlank(
                    message: 'L\'email est requis'
                ),
                new Assert\Email(
                    message: 'Email invalide'
                ),
            ],
        ]);

        $violations = $this->validator->validate(
            $data,
            $constraint
        );

        if (count($violations) > 0) {
            $errors = [];

            /** @var ConstraintViolation $violation */
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }

            return $this->json([
                'success' => false,
                'errors' => $errors,
            ], Response::HTTP_BAD_REQUEST);
        }

        $email = is_string($data['email'])
            ? trim($data['email'])
            : '';

        // Process the password reset request.
        $this->processSendingPasswordResetEmail(
            $email,
            $mailer,
            $request
        );

        // Always return the same response to prevent email enumeration.
        return $this->json([
            'success' => true,
            'message' => 'Si cet email existe, vous recevrez un lien de réinitialisation dans quelques minutes.',
        ]);
    }

    /**
     * Validate a password reset token.
     */
    #[Route('/validate/{token}', name: 'validate', methods: ['GET'])]
    public function validateToken(
        string $token
    ): JsonResponse {
        try {
            /** @var User $user */
            $user = $this->resetPasswordHelper
                ->validateTokenAndFetchUser($token);

            $this->securityLogger->info(
                'Password reset token validated',
                [
                    'user_id' => $user->getId() ?? 'unknown',
                    'action' => 'password_reset_token_validated',
                ]
            );

            return $this->json([
                'valid' => true,
                'user' => [
                    'email' => $user->getEmail(),
                    'name' => $user->getName(),
                ],
            ]);
        } catch (ResetPasswordExceptionInterface $e) {
            $this->securityLogger->warning(
                'Invalid password reset token accessed',
                [
                    'token_hash' => hash(
                        'sha256',
                        $token
                    ),
                    'error' => $e->getReason(),
                    'action' => 'password_reset_invalid_token',
                ]
            );

            return $this->json([
                'valid' => false,
                'error' => 'Token invalide ou expiré',
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Reset the password using a valid reset token.
     */
    #[Route('/reset', name: 'reset', methods: ['POST'])]
    public function resetPassword(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );

        if (
            !is_array($data)
            || !isset($data['token'])
            || !isset($data['password'])
        ) {
            return $this->json([
                'success' => false,
                'error' => 'Token et password requis',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validate the token and password.
        $constraint = new Assert\Collection([
            'token' => [
                new Assert\NotBlank(
                    message: 'Token requis'
                ),
            ],
            'password' => [
                new Assert\NotBlank(
                    message: 'Mot de passe requis'
                ),
                new Assert\Length(
                    min: 8,
                    minMessage: 'Le mot de passe doit contenir au moins 8 caractères'
                ),
            ],
        ]);

        $violations = $this->validator->validate(
            $data,
            $constraint
        );

        if (count($violations) > 0) {
            $errors = [];

            /** @var ConstraintViolation $violation */
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }

            return $this->json([
                'success' => false,
                'errors' => $errors,
            ], Response::HTTP_BAD_REQUEST);
        }

        $token = is_string($data['token'])
            ? $data['token']
            : '';

        $plainPassword = is_string($data['password'])
            ? $data['password']
            : '';

        try {
            /** @var User $user */
            $user = $this->resetPasswordHelper
                ->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface $e) {
            $this->securityLogger->warning(
                'Password reset failed - invalid token',
                [
                    'token_hash' => hash(
                        'sha256',
                        $token
                    ),
                    'error' => $e->getReason(),
                    'ip' => $request->getClientIp(),
                    'action' => 'password_reset_failed',
                ]
            );

            return $this->json([
                'success' => false,
                'error' => 'Token invalide ou expiré',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Store the old password hash for audit logging.
        $oldPasswordHash = $user->getPassword();

        // Hash and update the new password.
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $plainPassword
        );

        $user->setPassword($hashedPassword);

        // Save the updated user.
        $this->entityManager->flush();

        // Remove the reset request to prevent token reuse.
        $this->resetPasswordHelper->removeResetRequest($token);

        // Log the successful password reset.
        $this->securityLogger->info(
            'Password successfully reset via API',
            [
                'user_id' => $user->getId() ?? 'unknown',
                'email' => $user->getEmail(),
                'old_password_hash' => $oldPasswordHash,
                'new_password_hash' => $hashedPassword,
                'ip' => $request->getClientIp(),
                'user_agent' => $request->headers->get('User-Agent'),
                'action' => 'password_reset_completed',
            ]
        );

        return $this->json([
            'success' => true,
            'message' => 'Mot de passe réinitialisé avec succès',
        ]);
    }

    /**
     * Generate and send the password reset email.
     */
    private function processSendingPasswordResetEmail(
        string $emailFormData,
        MailerInterface $mailer,
        Request $request
    ): bool {
        /** @var User|null $user */
        $user = $this->entityManager
            ->getRepository(User::class)
            ->findOneBy([
                'email' => $emailFormData,
            ]);

        // Do not reveal whether the email exists.
        if (!$user) {
            $this->securityLogger->info(
                'Password reset requested for non-existent email',
                [
                    'email' => $emailFormData,
                    'ip' => $request->getClientIp(),
                    'action' => 'password_reset_invalid_email',
                ]
            );

            return true;
        }

        try {
            // Generate the reset token using ResetPasswordBundle.
            $resetToken = $this->resetPasswordHelper
                ->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface $e) {
            $this->securityLogger->warning(
                'Failed to generate reset token',
                [
                    'user_id' => $user->getId() ?? 'unknown',
                    'email' => $emailFormData,
                    'error' => $e->getReason(),
                    'action' => 'password_reset_token_failed',
                ]
            );

            // Do not expose internal errors to the user.
            return true;
        }

        // Build the Angular frontend reset URL.
        $frontendUrl = $_ENV['FRONTEND_URL']
            ?? 'https://stockcontrol.wip';

            assert(is_string($frontendUrl));
            $frontendResetUrl =
            rtrim($frontendUrl, '/')
            . '/reset-password/'
            . $resetToken->getToken();

           // Build the password reset email.
           $email = (new TemplatedEmail())
           ->from(
              new Address(
                'no-reply@stockcontrol.com',
                'Stock Control System'
            )
        )
        ->to((string) $user->getEmail())
        ->subject('Password Reset')
        ->htmlTemplate('reset_password/email.html.twig')
        ->context([
            'resetToken' => $resetToken,
            'user' => $user,
            'resetUrl' => $frontendResetUrl,
        ]);

        $mailer->send($email);
        $this->securityLogger->info(
            'Password reset email sent',
            [
                'user_id' => $user->getId() ?? 'unknown',
                'email' => $user->getEmail(),
                'expires_at' => $resetToken
                    ->getExpiresAt()
                    ->format('Y-m-d H:i:s'),
                'action' => 'password_reset_email_sent',
            ]
        );

        return true;
    }
}

