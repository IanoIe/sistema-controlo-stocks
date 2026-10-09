<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'stock_transfer')]
class StockTransfer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $transferDate = null;

    #[ORM\Column(length: 50)]
    private ?string $status = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notes = null;

    // Armazém de origem
    #[ORM\ManyToOne(inversedBy: 'outgoingTransfers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Warehouse $sourceWarehouse = null;

    // Armazém de destino
    #[ORM\ManyToOne(inversedBy: 'incomingTransfers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Warehouse $destinationWarehouse = null;

    // Utilizador que realizou a transferência
    #[ORM\ManyToOne(inversedBy: 'stockTransfers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * Itens desta transferência
     *
     * @var Collection<int, StockTransferItem>
     */
    #[ORM\OneToMany(
        targetEntity: StockTransferItem::class,
        mappedBy: 'stockTransfer',
        cascade: ['persist'],
        orphanRemoval: true
    )]
    private Collection $stockTransferItems;

    public function __construct()
    {
        $this->transferDate = new \DateTimeImmutable();
        $this->stockTransferItems = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTransferDate(): ?\DateTimeImmutable
    {
        return $this->transferDate;
    }

    public function setTransferDate(
        \DateTimeImmutable $transferDate
    ): static {
        $this->transferDate = $transferDate;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function getSourceWarehouse(): ?Warehouse
    {
        return $this->sourceWarehouse;
    }

    public function setSourceWarehouse(
        ?Warehouse $sourceWarehouse
    ): static {
        $this->sourceWarehouse = $sourceWarehouse;

        return $this;
    }

    public function getDestinationWarehouse(): ?Warehouse
    {
        return $this->destinationWarehouse;
    }

    public function setDestinationWarehouse(
        ?Warehouse $destinationWarehouse
    ): static {
        $this->destinationWarehouse = $destinationWarehouse;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, StockTransferItem>
     */
    public function getStockTransferItems(): Collection
    {
        return $this->stockTransferItems;
    }

    public function addStockTransferItem(
        StockTransferItem $stockTransferItem
    ): static {
        if (!$this->stockTransferItems->contains($stockTransferItem)) {
            $this->stockTransferItems->add($stockTransferItem);
            $stockTransferItem->setStockTransfer($this);
        }

        return $this;
    }

    public function removeStockTransferItem(
        StockTransferItem $stockTransferItem
    ): static {
        if ($this->stockTransferItems->removeElement($stockTransferItem)) {
            if ($stockTransferItem->getStockTransfer() === $this) {
                $stockTransferItem->setStockTransfer(null);
            }
        }

        return $this;
    }
}
