<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixtures extends Fixture
{
    public const CATEGORY_ELECTRONICS = 'category_electronics';
    public const CATEGORY_OFFICE = 'category_office';
    public const CATEGORY_FURNITURE = 'category_furniture';
    public const CATEGORY_ACCESSORIES = 'category_accessories';

    public function load(ObjectManager $manager): void
    {
        $categories = [
            self::CATEGORY_ELECTRONICS => 'Electronics',
            self::CATEGORY_OFFICE => 'Office',
            self::CATEGORY_FURNITURE => 'Furniture',
            self::CATEGORY_ACCESSORIES => 'Accessories',
        ];

        foreach ($categories as $reference => $nameCategory) {
            $category = new Category();

            $category->setNameCategory($nameCategory);

            $manager->persist($category);

            $this->addReference($reference, $category);
        }

        $manager->flush();
    }
}
