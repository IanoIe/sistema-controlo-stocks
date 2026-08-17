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

    public function load(ObjectManager $manager): void
    {
        $category = $this->getReference(
            CategoryFixtures::CATEGORY_ELECTRONICS,
            Category::class
        );

        $product = new Product();

        $product->setCodeProduct('PRD001');
        $product->setNameProduct('Keyboard');
        $product->setCategory($category);
        $product->setPrice('25.50');
        $product->setQuantity(10);
        $product->setStockMin(5);

        $manager->persist($product);

        $this->addReference(self::PRODUCT_KEYBOARD, $product);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CategoryFixtures::class,
        ];
    }
}
