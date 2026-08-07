<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var Collection<int, StockEntry>
     */
    #[ORM\OneToMany(targetEntity: StockEntry::class, mappedBy: 'user')]
    private Collection $stockEntries;

    /**
     * @var Collection<int, StockExit>
     */
    #[ORM\OneToMany(targetEntity: StockExit::class, mappedBy: 'user')]
    private Collection $stockExits;

    public function __construct()
    {
        $this->stockEntries = new ArrayCollection();
        $this->stockExits = new ArrayCollection();
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @return Collection<int, StockEntry>
     */
    public function getStockEntries(): Collection
    {
        return $this->stockEntries;
    }

    public function addStockEntry(StockEntry $stockEntry): static
    {
        if (!$this->stockEntries->contains($stockEntry)) {
            $this->stockEntries->add($stockEntry);
            $stockEntry->setUser($this);
        }

        return $this;
    }

    public function removeStockEntry(StockEntry $stockEntry): static
    {
        if ($this->stockEntries->removeElement($stockEntry)) {
            // set the owning side to null (unless already changed)
            if ($stockEntry->getUser() === $this) {
                $stockEntry->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, StockExit>
     */
    public function getStockExits(): Collection
    {
        return $this->stockExits;
    }

    public function addStockExit(StockExit $stockExit): static
    {
        if (!$this->stockExits->contains($stockExit)) {
            $this->stockExits->add($stockExit);
            $stockExit->setUser($this);
        }

        return $this;
    }

    public function removeStockExit(StockExit $stockExit): static
    {
        if ($this->stockExits->removeElement($stockExit)) {
            // set the owning side to null (unless already changed)
            if ($stockExit->getUser() === $this) {
                $stockExit->setUser(null);
            }
        }

        return $this;
    }
}
