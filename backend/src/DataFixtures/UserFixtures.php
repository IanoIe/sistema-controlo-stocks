<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public const USER_ADMIN = 'user_admin';
    
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $user = new User();

        $user->setName('Administrador');
        $user->setEmail('admin@.com');
        $user->setRoles(['ROLE_ADMIN']);

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            'Admin123!'
        );

        $user->setPassword($hashedPassword);

        $manager->persist($user);

        $this->addReference(self::USER_ADMIN, $user);

        $manager->flush();
    }
}
