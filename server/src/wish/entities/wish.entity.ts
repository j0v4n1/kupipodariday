import { BaseEntity } from '@app/common/base.entity';
import { Offer } from '@app/offer/entities/offer.entity';
import { User } from '@app/user/entities/user.entity';
import { Wishlist } from '@app/wishlist/entities/wishlist.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
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

  @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
  owner: User;

  @Column({ length: 1024 })
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item, { onDelete: 'CASCADE' })
  offers: Offer[];

  @Column({ type: 'int', default: 0 })
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items, {
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];
}
