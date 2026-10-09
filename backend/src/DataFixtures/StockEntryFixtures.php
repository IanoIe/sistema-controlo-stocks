<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\StockEntry;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class StockEntryFixtures extends Fixture implements DependentFixtureInterface
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

        // Create a stock entry
        $stockEntry = new StockEntry();

        $stockEntry->setQuantity(10);
        $stockEntry->setDateStockEntry(new \DateTime());
        $stockEntry->setReason('REPLENISHMENT');
        $stockEntry->setNotes('Initial test stock entry');
        $stockEntry->setProduct($product);
        $stockEntry->setUser($user);

        $manager->persist($stockEntry);

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
