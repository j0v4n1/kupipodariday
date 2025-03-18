import { BaseEntity } from '@app/common/base.entity';
import { UserEntity } from '@app/user/entities/user.entity';
import { WishEntity } from '@app/wish/entities/wish.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('wishlists')
export class WishlistEntity extends BaseEntity {
  @Column({ length: 250 })
  name: string;

  @Column({ length: 1500 })
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => WishEntity, (wish) => wish.wishlists, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  items: WishEntity[];

  @ManyToOne(() => UserEntity, (user) => user.wishlists, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
