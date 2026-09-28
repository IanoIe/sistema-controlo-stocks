<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UpdateMeAction extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        /*
         * Get the currently authenticated user.
         */
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'success' => false,
                'error' => 'User not authenticated.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        /*
         * Decode JSON request body.
         */
        $data = json_decode(
            $request->getContent(),
            true
        );

        if (!is_array($data)) {
            return $this->json([
                'success' => false,
                'error' => 'Invalid JSON.',
            ], Response::HTTP_BAD_REQUEST);
        }

        /*
         * Update name.
         */
        if (array_key_exists('name', $data)) {

            if (
                !is_string($data['name'])
                || trim($data['name']) === ''
            ) {
                return $this->json([
                    'success' => false,
                    'error' => 'Invalid name.',
                ], Response::HTTP_BAD_REQUEST);
            }

            $user->setName(
                trim($data['name'])
            );
        }

        /*
         * Update email.
         */
        if (array_key_exists('email', $data)) {

            if (
                !is_string($data['email'])
                || trim($data['email']) === ''
                || !filter_var(
                    trim($data['email']),
                    FILTER_VALIDATE_EMAIL
                )
            ) {
                return $this->json([
                    'success' => false,
                    'error' => 'Invalid email.',
                ], Response::HTTP_BAD_REQUEST);
            }

            $newEmail = strtolower(
                trim($data['email'])
            );

            /*
             * Check if another user already
             * has this email.
             */
            $existingUser = $this->entityManager
                ->getRepository(User::class)
                ->findOneBy([
                    'email' => $newEmail,
                ]);

            if (
                $existingUser !== null
                && $existingUser->getId() !== $user->getId()
            ) {
                return $this->json([
                    'success' => false,
                    'error' => 'This email is already in use.',
                ], Response::HTTP_BAD_REQUEST);
            }

            $user->setEmail($newEmail);
        }

        /*
         * Update password.
         *
         * Frontend sends:
         * - currentPassword
         * - newPassword
         */
        $hasCurrentPassword = array_key_exists(
            'currentPassword',
            $data
        );

        $hasNewPassword = array_key_exists(
            'newPassword',
            $data
        );

        if (
            $hasCurrentPassword
            || $hasNewPassword
        ) {

            /*
             * Both passwords are required.
             */
            if (
                !$hasCurrentPassword
                || !$hasNewPassword
                || !is_string($data['currentPassword'])
                || !is_string($data['newPassword'])
                || trim($data['currentPassword']) === ''
                || trim($data['newPassword']) === ''
            ) {
                return $this->json([
                    'success' => false,
                    'error' => 'Current password and new password are required.',
                ], Response::HTTP_BAD_REQUEST);
            }

            /*
             * New password must have at least 8 characters.
             */
            if (
                strlen($data['newPassword']) < 8
            ) {
                return $this->json([
                    'success' => false,
                    'error' => 'New password must contain at least 8 characters.',
                ], Response::HTTP_BAD_REQUEST);
            }

            /*
             * Check current password.
             */
            if (
                !$this->passwordHasher->isPasswordValid(
                    $user,
                    $data['currentPassword']
                )
            ) {
                return $this->json([
                    'success' => false,
                    'error' => 'Current password is incorrect.',
                ], Response::HTTP_BAD_REQUEST);
            }

            /*
             * Hash the new password.
             */
            $hashedPassword =
                $this->passwordHasher->hashPassword(
                    $user,
                    $data['newPassword']
                );

            $user->setPassword(
                $hashedPassword
            );
        }

        /*
         * Save changes to database.
         */
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        /*
         * Return updated user.
         */
        return $this->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'user' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'email' => $user->getEmail(),
            ],
        ]);
    }
}
