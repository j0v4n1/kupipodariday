import { BaseEntity } from '@app/common/base.entity';
import { OfferEntity } from '@app/offer/entities/offer.entity';
import { UserEntity } from '@app/user/entities/user.entity';
import { WishlistEntity } from '@app/wishlist/entities/wishlist.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity('wishes')
export class WishEntity extends BaseEntity {
  @Column({ length: 250 })
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({ scale: 2 })
  price: number;

  @Column({ scale: 2 })
  raised: number;

  @ManyToOne(() => UserEntity, (user) => user.wishes, { onDelete: 'CASCADE' })
  owner: UserEntity;

  @Column({ length: 1024 })
  description: string;

  @OneToMany(() => OfferEntity, (offer) => offer.item, { onDelete: 'CASCADE' })
  offers: OfferEntity[];

  @Column({ type: 'int', default: 0 })
  copied: number;

  @ManyToMany(() => WishlistEntity, (wishlist) => wishlist.items, {
    onDelete: 'CASCADE',
  })
  wishlists: WishlistEntity[];
}
