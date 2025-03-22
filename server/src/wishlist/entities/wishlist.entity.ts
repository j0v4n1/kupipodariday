import { BaseEntity } from '@app/common/base.entity';
import { User } from '@app/user/entities/user.entity';
import { Wish } from '@app/wish/entities/wish.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({ length: 250 })
  name: string;

  @Column({ length: 1500 })
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlists, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists, {
    onDelete: 'CASCADE',
  })
  user: User;
}
