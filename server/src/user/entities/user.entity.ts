import { BaseEntity } from '@app/common/base.entity';
import { OfferEntity } from '@app/offer/entities/offer.entity';
import { WishEntity } from '@app/wish/entities/wish.entity';
import { WishlistEntity } from '@app/wishlist/entities/wishlist.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { hash } from 'bcrypt';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => WishEntity, (wish) => wish.owner, { onDelete: 'CASCADE' })
  wishes: WishEntity[];

  @OneToMany(() => OfferEntity, (offer) => offer.user, { onDelete: 'CASCADE' })
  offers: OfferEntity[];

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.user, {
    onDelete: 'CASCADE',
  })
  wishlists: WishlistEntity[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await hash(this.password, 10);
  }
}
