import { BaseEntity } from '@app/common/base.entity';
import { User } from '@app/user/entities/user.entity';
import { Wish } from '@app/wish/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('offers')
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
  item: Wish;

  @Column({ scale: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
