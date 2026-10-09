<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Product;
use App\Entity\StockEntry;
use App\Entity\StockExit;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class StockService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function processEntry(StockEntry $stockEntry): StockEntry
    {
        $product = $stockEntry->getProduct();

        if (!$product instanceof Product) {
            throw new BadRequestHttpException('É necessário indicar um produto.');
        }

        if (!$product->isActive()) {
            throw new BadRequestHttpException('Não é possível movimentar stock de um produto inativo.');
        }

        $quantity = $stockEntry->getQuantity();

        if ($quantity === null || $quantity <= 0) {
            throw new BadRequestHttpException('A quantidade deve ser superior a zero.');
        }

        $currentQuantity = $product->getQuantity() ?? 0;

        $product->setQuantity($currentQuantity + $quantity);
        $product->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($stockEntry);
        $this->entityManager->persist($product);

        return $stockEntry;
    }

    public function processExit(StockExit $stockExit): StockExit
    {
        $product = $stockExit->getProduct();

        if (!$product instanceof Product) {
            throw new BadRequestHttpException('É necessário indicar um produto.');
        }

        if (!$product->isActive()) {
            throw new BadRequestHttpException('Não é possível movimentar stock de um produto inativo.');
        }

        $quantity = $stockExit->getQuantity();

        if ($quantity === null || $quantity <= 0) {
            throw new BadRequestHttpException('A quantidade deve ser superior a zero.');
        }

        $currentQuantity = $product->getQuantity() ?? 0;

        if ($quantity > $currentQuantity) {
            throw new BadRequestHttpException(
                sprintf(
                    'Stock insuficiente. Stock disponível: %d.',
                    $currentQuantity
                )
            );
        }

        $product->setQuantity($currentQuantity - $quantity);
        $product->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($stockExit);
        $this->entityManager->persist($product);

        return $stockExit;
    }
}
