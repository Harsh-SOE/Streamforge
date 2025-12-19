import { ReactionAggregate } from '@reaction/domain/aggregates';
import { ReactionDomainStatus } from '@reaction/domain/enums';

export interface ReactionRepositoryPort {
  saveReaction(model: ReactionAggregate): Promise<ReactionAggregate>;

  saveManyReaction(models: ReactionAggregate[]): Promise<number>;

  updateOneReactionById(
    id: string,
    newLikeStatus: ReactionDomainStatus,
  ): Promise<ReactionAggregate>;

  updateOneReactionByUserAndVideoId(
    data: { userId: string; videoId: string },
    newLikeStatus: ReactionDomainStatus,
  ): Promise<ReactionAggregate>;
}

export const REACTION_DATABASE_PORT = Symbol('REACTION_DATABASE_PORT');
