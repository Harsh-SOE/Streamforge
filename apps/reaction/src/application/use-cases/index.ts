import { DislikeCommandHandler } from './dislike-command';
import { LikeCommandHandler } from './like-command';
import { UnDislikeCommandHandler } from './undislike-command';
import { UnlikeCommandHandler } from './unlike-command';

export const LikeActionCommandHandler = [
  DislikeCommandHandler,
  LikeCommandHandler,
  UnDislikeCommandHandler,
  UnlikeCommandHandler,
];
