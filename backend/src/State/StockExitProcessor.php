<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\StockExit;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Bundle\SecurityBundle\Security;

final class StockExitProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = [],
    ): mixed {
        if (!$data instanceof StockExit) {
            return $data;
        }

        $product = $data->getProduct();

        if ($product === null) {
            throw new BadRequestHttpException('O produto é obrigatório.');
        }

        $quantity = $data->getQuantity();

        if ($quantity === null || $quantity <= 0) {
            throw new BadRequestHttpException(
                'A quantidade da saída deve ser maior que zero.'
            );
        }

        $currentStock = $product->getQuantity() ?? 0;

        if ($quantity > $currentStock) {
            throw new BadRequestHttpException(
                sprintf(
                    'Stock insuficiente. Stock atual: %d. Quantidade solicitada: %d.',
                    $currentStock,
                    $quantity
                )
            );
        }

        $user = $this->security->getUser();

        if (!$user instanceof \App\Entity\User) {
            throw new BadRequestHttpException(
                'Não foi possível identificar o utilizador autenticado.'
            );
        }

        $data->setUser($user);

        if ($data->getDateStockExit() === null) {
            $data->setDateStockExit(new \DateTime());
        }

        $product->setQuantity($currentStock - $quantity);
        $product->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($data);
        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $data;
    }
}
