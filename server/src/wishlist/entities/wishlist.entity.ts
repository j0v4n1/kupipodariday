import { BaseEntity } from '@app/common/base.entity';
import { User } from '@app/user/entities/user.entity';
import { Wish } from '@app/wish/entities/wish.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('wishlists')
export class Wishlist extends BaseEntity {
  @Column({ length: 250 })
  name: string;

  @Column({ length: 1500, default: 'Подборка подарков для любого случая.' })
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.wishlists, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  items: Wish[];
}
