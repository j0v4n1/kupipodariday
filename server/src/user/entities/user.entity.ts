import { BaseEntity } from '@app/common/base.entity';
import { Offer } from '@app/offer/entities/offer.entity';
import { Wish } from '@app/wish/entities/wish.entity';
import { Wishlist } from '@app/wishlist/entities/wishlist.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { hash } from 'bcrypt';

@Entity('users')
export class User extends BaseEntity {
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

  @Column({ default: null, nullable: true })
  refreshToken: string;

  @OneToMany(() => Wish, (wish) => wish.owner, { onDelete: 'CASCADE' })
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user, { onDelete: 'CASCADE' })
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user, {
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];

  @BeforeInsert()
  async hashData() {
    if (this.password) this.password = await hash(this.password, 10);
    if (this.refreshToken) this.refreshToken = await hash(this.refreshToken, 10);
  }
}
