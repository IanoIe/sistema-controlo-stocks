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
        // ADMIN 1
        $admin = new User();

        $admin->setName('Administrador');
        $admin->setEmail('admin@.com');
        $admin->setRoles(['ROLE_ADMIN']);

        $admin->setPassword(
            $this->passwordHasher->hashPassword(
                $admin,
                'Admin123!'
            )
        );

        $manager->persist($admin);

        $this->addReference(self::USER_ADMIN, $admin);


        // ADMIN 2
        $admin2 = new User();

        $admin2->setName('Administrador 2');
        $admin2->setEmail('admin2@.com');
        $admin2->setRoles(['ROLE_ADMIN']);

        $admin2->setPassword(
            $this->passwordHasher->hashPassword(
                $admin2,
                'Admin456!'
            )
        );

        $manager->persist($admin2);


        // USER 1
        $user1 = new User();

        $user1->setName('João Silva');
        $user1->setEmail('joao@.com');
        $user1->setRoles(['ROLE_USER']);

        $user1->setPassword(
            $this->passwordHasher->hashPassword(
                $user1,
                'User123!'
            )
        );

        $manager->persist($user1);


        // USER 2
        $user2 = new User();

        $user2->setName('Maria Santos');
        $user2->setEmail('maria@.com');
        $user2->setRoles(['ROLE_USER']);

        $user2->setPassword(
            $this->passwordHasher->hashPassword(
                $user2,
                'User123!'
            )
        );

        $manager->persist($user2);


        // USER 3
        $user3 = new User();

        $user3->setName('Pedro Costa');
        $user3->setEmail('pedro@.com');
        $user3->setRoles(['ROLE_USER']);

        $user3->setPassword(
            $this->passwordHasher->hashPassword(
                $user3,
                'User123!'
            )
        );

        $manager->persist($user3);


        $manager->flush();
    }
}
