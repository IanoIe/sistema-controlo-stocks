<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Controller\Api\MeAction;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['user_read']],
    denormalizationContext: ['groups' => ['user_write']],
    operations: [
        new GetCollection(
            security: 'is_granted("ROLE_ADMIN")',
        ),
        new Get(
            security: 'is_granted("ROLE_ADMIN")',
        ),
        new Get(
            uriTemplate: '/me',
            controller: MeAction::class,
            read: false,
            security: 'is_granted("ROLE_USER")',
            name: 'api_me',
        ),

        new Delete(
            security: 'is_granted("ROLE_ADMIN") and (object == user or not ("ROLE_ADMIN" in object.getRoles()))',
            securityMessage: 'Only administrators can delete non-administrator users.',
        ),
    ],
)]

class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user_read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_read', 'user_write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['user_read', 'user_write'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column]
    #[Groups(['user_read'])]
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

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
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
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function eraseCredentials(): void
    {
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
            if ($stockExit->getUser() === $this) {
                $stockExit->setUser(null);
            }
        }

        return $this;
    }
}
