<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ProductFixtures extends Fixture implements DependentFixtureInterface
{
    public const PRODUCT_KEYBOARD = 'product_keyboard';
    public const PRODUCT_DESK = 'product_desk';

    public function load(ObjectManager $manager): void
    {
        // Retrieve product categories
        $electronicsCategory = $this->getReference(
            CategoryFixtures::CATEGORY_ELECTRONICS,
            Category::class
        );

        $furnitureCategory = $this->getReference(
            CategoryFixtures::CATEGORY_FURNITURE,
            Category::class
        );

        // PRODUCT 1 - Keyboard
        $keyboard = new Product();

        $keyboard->setCodeProduct('PRD001');
        $keyboard->setNameProduct('Keyboard');
        $keyboard->setCategory($electronicsCategory);
        $keyboard->setPrice('25.50');
        $keyboard->setQuantity(10);
        $keyboard->setStockMin(5);
        $keyboard->setActive(true);

        $manager->persist($keyboard);

        $this->addReference(self::PRODUCT_KEYBOARD, $keyboard);


        // PRODUCT 2 - Office desk
        $desk = new Product();

        $desk->setCodeProduct('PRD002');
        $desk->setNameProduct('Office Desk');
        $desk->setCategory($furnitureCategory);
        $desk->setPrice('150.00');
        $desk->setQuantity(5);
        $desk->setStockMin(2);
        $desk->setActive(true);

        $manager->persist($desk);

        $this->addReference(self::PRODUCT_DESK, $desk);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CategoryFixtures::class,
        ];
    }
}
