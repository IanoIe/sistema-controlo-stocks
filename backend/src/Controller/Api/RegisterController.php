<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegisterController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validate JSON
        if (!is_array($data)) {
            return new JsonResponse([
                'message' => 'Invalid JSON data.'
            ], 400);
        }

        // Get form data
        $name = trim($data['name'] ?? '');
        $email = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';

        // Validate required fields
        if ($name === '' || $email === '' || $password === '') {
            return new JsonResponse([
                'message' => 'All fields are required.'
            ], 400);
        }

        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse([
                'message' => 'Invalid email address.'
            ], 400);
        }

        // Validate password
        if (!is_string($password) || strlen($password) < 8) {
            return new JsonResponse([
                'message' => 'Password must contain at least 8 characters.'
            ], 400);
        }

        // Check if email already exists
        if ($this->userRepository->findOneBy(['email' => $email])) {
            return new JsonResponse([
                'message' => 'This email is already registered.'
            ], 409);
        }

        // Create user
        $user = new User();

        $user->setName($name);
        $user->setEmail($email);

        // Hash password
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $password
        );

        $user->setPassword($hashedPassword);

        // Assign default role
        $user->setRoles(['ROLE_USER']);

        // Save user
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Return success response
        return new JsonResponse([
            'message' => 'Account created successfully.'
        ], 201);
    }
}
