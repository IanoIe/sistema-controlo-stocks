<?php

namespace App\DataFixtures;

use App\DataFixtures\ProductFixtures;
use App\DataFixtures\UserFixtures;
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
        $product = $this->getReference(
            ProductFixtures::PRODUCT_KEYBOARD,
            Product::class
        );

        $user = $this->getReference(
            UserFixtures::USER_ADMIN,
            User::class
        );

        $stockExit = new StockExit();

        $stockExit->setQuantity(2);
        $stockExit->setDateStockExit(new \dateTime());
        $stockExit->setProduct($product);
        $stockExit->setUser($user);

        $manager->persist($stockExit);

        $manager->flush();
    }

    #[Override]
    public function getDependencies(): array
    {
        return [
            ProductFixtures::class,
            UserFixtures::class,
        ];
    }
}
