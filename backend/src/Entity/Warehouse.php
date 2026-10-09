<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'warehouse')]
class Warehouse
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $location = null;

    #[ORM\Column]
    private bool $active = true;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * Transferências em que este armazém é a origem.
     *
     * @var Collection<int, StockTransfer>
     */
    #[ORM\OneToMany(
        targetEntity: StockTransfer::class,
        mappedBy: 'sourceWarehouse'
    )]
    private Collection $outgoingTransfers;

    /**
     * Transferências em que este armazém é o destino.
     *
     * @var Collection<int, StockTransfer>
     */
    #[ORM\OneToMany(
        targetEntity: StockTransfer::class,
        mappedBy: 'destinationWarehouse'
    )]
    private Collection $incomingTransfers;

    /**
     * Stock deste armazém.
     *
     * @var Collection<int, WarehouseStock>
     */
    #[ORM\OneToMany(
        targetEntity: WarehouseStock::class,
        mappedBy: 'warehouse'
    )]
    private Collection $warehouseStocks;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();

        $this->outgoingTransfers = new ArrayCollection();
        $this->incomingTransfers = new ArrayCollection();
        $this->warehouseStocks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): static
    {
        $this->active = $active;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /*
     * Outgoing transfers
     */

    /**
     * @return Collection<int, StockTransfer>
     */
    public function getOutgoingTransfers(): Collection
    {
        return $this->outgoingTransfers;
    }

    public function addOutgoingTransfer(StockTransfer $stockTransfer): static
    {
        if (!$this->outgoingTransfers->contains($stockTransfer)) {
            $this->outgoingTransfers->add($stockTransfer);
            $stockTransfer->setSourceWarehouse($this);
        }

        return $this;
    }

    public function removeOutgoingTransfer(
        StockTransfer $stockTransfer
    ): static {
        if ($this->outgoingTransfers->removeElement($stockTransfer)) {
            if ($stockTransfer->getSourceWarehouse() === $this) {
                $stockTransfer->setSourceWarehouse(null);
            }
        }

        return $this;
    }

    /*
     * Incoming transfers
     */

    /**
     * @return Collection<int, StockTransfer>
     */
    public function getIncomingTransfers(): Collection
    {
        return $this->incomingTransfers;
    }

    public function addIncomingTransfer(StockTransfer $stockTransfer): static
    {
        if (!$this->incomingTransfers->contains($stockTransfer)) {
            $this->incomingTransfers->add($stockTransfer);
            $stockTransfer->setDestinationWarehouse($this);
        }

        return $this;
    }

    public function removeIncomingTransfer(
        StockTransfer $stockTransfer
    ): static {
        if ($this->incomingTransfers->removeElement($stockTransfer)) {
            if ($stockTransfer->getDestinationWarehouse() === $this) {
                $stockTransfer->setDestinationWarehouse(null);
            }
        }

        return $this;
    }

    /*
     * WarehouseStock
     */

    /**
     * @return Collection<int, WarehouseStock>
     */
    public function getWarehouseStocks(): Collection
    {
        return $this->warehouseStocks;
    }

    public function addWarehouseStock(
        WarehouseStock $warehouseStock
    ): static {
        if (!$this->warehouseStocks->contains($warehouseStock)) {
            $this->warehouseStocks->add($warehouseStock);
            $warehouseStock->setWarehouse($this);
        }

        return $this;
    }

    public function removeWarehouseStock(
        WarehouseStock $warehouseStock
    ): static {
        if ($this->warehouseStocks->removeElement($warehouseStock)) {
            if ($warehouseStock->getWarehouse() === $this) {
                $warehouseStock->setWarehouse(null);
            }
        }

        return $this;
    }
}
