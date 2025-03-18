import { BaseEntity } from '@app/common/base.entity';
import { UserEntity } from '@app/user/entities/user.entity';
import { WishEntity } from '@app/wish/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('offers')
export class OfferEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.offers, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => WishEntity, (wish) => wish.offers, { onDelete: 'CASCADE' })
  item: WishEntity;

  @Column({ scale: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
