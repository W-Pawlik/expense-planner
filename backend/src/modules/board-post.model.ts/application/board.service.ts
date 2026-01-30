import { BoardPostRepository } from '../infrastructure/board.repository';
import { ApprovalStatus } from '../../../core/enums/ApprovalStatus.enum';
import { AppError } from '../../../core/errors/AppError';
import { BoardPostDTO, ListBoardPostsResult } from '../domain/board.types';

export interface IBoardService {
  ensurePostForGroup(
    groupId: string,
    authorId: string,
    description?: string,
  ): Promise<BoardPostDTO>;
  hidePostForGroup(groupId: string): Promise<void>;
  removePostForGroup(groupId: string): Promise<void>;
  listPublicPosts(page: number, limit: number): Promise<ListBoardPostsResult>;
  getPublicPost(postId: string): Promise<BoardPostDTO>;
  getPublicPostByGroupId(groupId: string): Promise<BoardPostDTO>;
  listPendingPosts(page: number, limit: number): Promise<ListBoardPostsResult>;
  approvePost(postId: string): Promise<void>;
  rejectPost(postId: string): Promise<void>;
}

export class BoardService implements IBoardService {
  private boardRepository: BoardPostRepository;

  constructor() {
    this.boardRepository = new BoardPostRepository();
  }

  public async ensurePostForGroup(
    groupId: string,
    authorId: string,
    description?: string,
  ): Promise<BoardPostDTO> {
    const params: { groupId: string; authorId: string; description?: string } = {
      groupId,
      authorId,
    };

    if (description !== undefined) {
      params.description = description;
    }

    const post = await this.boardRepository.findOrCreateForGroup(params);

    return this.toDTO(post);
  }

  public async hidePostForGroup(groupId: string): Promise<void> {
    await this.boardRepository.markRemovedForGroup(groupId);
  }

  public async removePostForGroup(groupId: string): Promise<void> {
    await this.boardRepository.deleteForGroup(groupId);
  }

  public async listPublicPosts(page: number, limit: number): Promise<ListBoardPostsResult> {
    const { posts, total } = await this.boardRepository.findPublic(page, limit);

    return {
      posts: posts.map((p) => this.toDTO(p)),
      total,
      page,
      limit,
    };
  }

  public async getPublicPost(postId: string): Promise<BoardPostDTO> {
    const post = await this.boardRepository.findPublicById(postId);
    if (!post) {
      throw new AppError('Board post not found', 404);
    }
    return this.toDTO(post);
  }

  public async getPost(postId: string): Promise<BoardPostDTO> {
    const post = await this.boardRepository.findById(postId);
    if (!post) throw new AppError('Board post not found', 404);
    return this.toDTO(post);
  }

  public async getPublicPostByGroupId(groupId: string): Promise<BoardPostDTO> {
    const post = await this.boardRepository.findPublicByGroupId(groupId);
    if (!post) throw new AppError('Board post not found', 404);
    return this.toDTO(post);
  }

  public async listPendingPosts(page: number, limit: number): Promise<ListBoardPostsResult> {
    const { posts, total } = await this.boardRepository.findPending(page, limit);

    return {
      posts: posts.map((p) => this.toDTO(p)),
      total,
      page,
      limit,
    };
  }

  public async approvePost(postId: string): Promise<void> {
    const post = await this.boardRepository.setApprovalStatus(postId, ApprovalStatus.APPROVED);
    if (!post) {
      throw new AppError('Board post not found', 404);
    }
  }

  public async rejectPost(postId: string): Promise<void> {
    const post = await this.boardRepository.setApprovalStatus(postId, ApprovalStatus.REJECTED);
    if (!post) {
      throw new AppError('Board post not found', 404);
    }
  }

  public async getPostByGroupId(groupId: string): Promise<BoardPostDTO | null> {
    const post = await this.boardRepository.findByGroupId(groupId);
    return post ? this.toDTO(post) : null;
  }

  private toDTO(p: any): BoardPostDTO {
    return {
      id: p._id.toString(),
      groupId: p.groupId.toString(),
      authorId: p.authorId.toString(),
      description: p.description,
      publicationStatus: p.publicationStatus,
      approvalStatus: p.approvalStatus,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}
