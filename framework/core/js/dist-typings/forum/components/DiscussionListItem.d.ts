import Component, { ComponentAttrs } from '../../common/Component';
import ItemList from '../../common/utils/ItemList';
import SubtreeRetainer from '../../common/utils/SubtreeRetainer';
import type Discussion from '../../common/models/Discussion';
import type Mithril from 'mithril';
import type { DiscussionListParams } from '../states/DiscussionListState';
import Post from '../../common/models/Post';
import type User from '../../common/models/User';
export interface IDiscussionListItemAttrs extends ComponentAttrs {
    discussion: Discussion;
    post?: Post;
    params: DiscussionListParams;
    jumpTo?: number;
    author?: User;
}
/**
 * The `DiscussionListItem` component shows a single discussion in the
 * discussion list.
 */
export default class DiscussionListItem<CustomAttrs extends IDiscussionListItemAttrs = IDiscussionListItemAttrs> extends Component<CustomAttrs> {
    /**
     * Ensures that the discussion will not be redrawn
     * unless new data comes in.
     */
    subtree: SubtreeRetainer;
    highlightRegExp?: RegExp;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    elementAttrs(): {
        className: string;
    };
    view(): JSX.Element;
    viewItems(): ItemList<Mithril.Children>;
    controlsView(controls: Mithril.ChildArray): Mithril.Children;
    slidableUnderneathView(): Mithril.Children;
    contentView(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    authorView(): Mithril.Children;
    authorItems(): ItemList<Mithril.Children>;
    badgesView(): Mithril.Children;
    mainView(): Mithril.Children;
    getJumpTo(): number;
    oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    onbeforeupdate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): boolean;
    /**
     * Determine whether or not the discussion is currently being viewed.
     */
    active(): boolean;
    /**
     * Determine whether or not information about who started the discussion
     * should be displayed instead of information about the most recent reply to
     * the discussion.
     */
    showFirstPost(): boolean;
    /**
     * Determine whether or not the number of replies should be shown instead of
     * the number of unread posts.
     *
     * @return {boolean}
     */
    showRepliesCount(): boolean;
    /**
     * Mark the discussion as read.
     */
    markAsRead(): void;
    /**
     * Build an item list of info for a discussion listing. By default this is
     * just the first/last post indicator.
     */
    infoItems(): ItemList<Mithril.Children>;
    statsView(): Mithril.Children;
    statsItems(): ItemList<Mithril.Children>;
    replyCountItem(): JSX.Element;
}
export interface DiscussionListItemStatsItemAttrs extends ComponentAttrs {
    icon: string;
    label: string;
    a11yLabel?: string;
}
export declare class DiscussionListItemStatsItem extends Component<DiscussionListItemStatsItemAttrs> {
    view(vnode: Mithril.Vnode<DiscussionListItemStatsItemAttrs>): JSX.Element;
}
