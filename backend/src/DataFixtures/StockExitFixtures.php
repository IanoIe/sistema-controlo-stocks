<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\StockExit;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class StockExitFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Retrieve the keyboard product
        $product = $this->getReference(
            ProductFixtures::PRODUCT_KEYBOARD,
            Product::class
        );

        // Retrieve the administrator
        $user = $this->getReference(
            UserFixtures::USER_ADMIN,
            User::class
        );

        // Create a stock exit
        $stockExit = new StockExit();

        $stockExit->setQuantity(2);
        $stockExit->setDateStockExit(new \DateTime());
        $stockExit->setReason('SALE');
        $stockExit->setNotes('Keyboard stock exit for testing');
        $stockExit->setProduct($product);
        $stockExit->setUser($user);

        $manager->persist($stockExit);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ProductFixtures::class,
            UserFixtures::class,
        ];
    }
}
