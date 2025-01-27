import app from '../../forum/app';
import DiscussionPage from '../components/DiscussionPage';
import Button from '../../common/components/Button';
import Separator from '../../common/components/Separator';
import RenameDiscussionModal from '../components/RenameDiscussionModal';
import ItemList from '../../common/utils/ItemList';
import extractText from '../../common/utils/extractText';

/**
 * The `DiscussionControls` utility constructs a list of buttons for a
 * discussion which perform actions on it.
 */
const DiscussionControls = {
  /**
   * Get a list of controls for a discussion.
   *
   * @param {import('../../common/models/Discussion').default} discussion
   * @param {import('../../common/Component').default<any, any>} context The parent component under which the controls menu will be displayed.
   *
   * @return {ItemList<import('mithril').Children>}
   */
  controls(discussion, context) {
    const items = new ItemList();

    ['user', 'moderation', 'destructive'].forEach((section) => {
      const controls = this[section + 'Controls'](discussion, context).toArray();
      if (controls.length) {
        controls.forEach((item) => items.add(item.itemName, item));
        items.add(section + 'Separator', <Separator />);
      }
    });

    return items;
  },

  /**
   * Get controls for a discussion pertaining to the current user (e.g. reply,
   * follow).
   *
   * @param {import('../../common/models/Discussion').default} discussion
   * @param {import('../../common/Component').default<any, any>}  context The parent component under which the controls menu will be displayed.
   *
   * @return {ItemList<import('mithril').Children>}
   * @protected
   */
  userControls(discussion, context) {
    const items = new ItemList();

    // Only add a reply control if this is the discussion's controls dropdown
    // for the discussion page itself. We don't want it to show up for
    // discussions in the discussion list, etc.
    if (context instanceof DiscussionPage) {
      items.add(
        'reply',
        !app.session.user || discussion.canReply() ? (
          <Button
            icon="fas fa-reply"
            onclick={() => {
              // If the user is not logged in, the promise rejects, and a login modal shows up.
              // Since that's already handled, we dont need to show an error message in the console.
              return this.replyAction
                .bind(discussion)(true, false)
                .catch(() => {});
            }}
          >
            {app.translator.trans(
              app.session.user ? 'core.forum.discussion_controls.reply_button' : 'core.forum.discussion_controls.log_in_to_reply_button'
            )}
          </Button>
        ) : (
          <Button
            icon="fas fa-reply"
            className="disabled"
            title={extractText(app.translator.trans('core.forum.discussion_controls.cannot_reply_text'))}
          >
            {app.translator.trans('core.forum.discussion_controls.cannot_reply_button')}
          </Button>
        )
      );
    }

    return items;
  },

  /**
   * Get controls for a discussion pertaining to moderation (e.g. rename, lock).
   *
   * @param {import('../../common/models/Discussion').default} discussion
   * @param {import('../../common/Component').default<any, any>}  context The parent component under which the controls menu will be displayed.
   *
   * @return {ItemList<import('mithril').Children>}
   * @protected
   */
  moderationControls(discussion) {
    const items = new ItemList();

    if (discussion.canRename()) {
      items.add(
        'rename',
        <Button icon="fas fa-pencil-alt" onclick={this.renameAction.bind(discussion)}>
          {app.translator.trans('core.forum.discussion_controls.rename_button')}
        </Button>
      );
    }

    return items;
  },

  /**
   * Get controls for a discussion which are destructive (e.g. delete).
   *
   * @param {import('../../common/models/Discussion').default} discussion
   * @param {import('../../common/Component').default<any, any>}  context The parent component under which the controls menu will be displayed.
   *
   * @return {ItemList<import('mithril').Children>}
   * @protected
   */
  destructiveControls(discussion) {
    const items = new ItemList();

    if (!discussion.isHidden()) {
      if (discussion.canHide()) {
        items.add(
          'hide',
          <Button icon="far fa-trash-alt" onclick={this.hideAction.bind(discussion)}>
            {app.translator.trans('core.forum.discussion_controls.delete_button')}
          </Button>
        );
      }
    } else {
      if (discussion.canHide()) {
        items.add(
          'restore',
          <Button icon="fas fa-reply" onclick={this.restoreAction.bind(discussion)}>
            {app.translator.trans('core.forum.discussion_controls.restore_button')}
          </Button>
        );
      }

      if (discussion.canDelete()) {
        items.add(
          'delete',
          <Button icon="fas fa-times" onclick={this.deleteAction.bind(discussion)}>
            {app.translator.trans('core.forum.discussion_controls.delete_forever_button')}
          </Button>
        );
      }
    }

    return items;
  },

  /**
   * Open the reply composer for the discussion. A promise will be returned,
   * which resolves when the composer opens successfully. If the user is not
   * logged in, they will be prompted. If they don't have permission to
   * reply, the promise will be rejected.
   *
   * @param {boolean} goToLast Whether or not to scroll down to the last post if the discussion is being viewed.
   * @param {boolean} forceRefresh Whether or not to force a reload of the composer component, even if it is already open for this discussion.
   *
   * @return {Promise<import('../states/ComposerState.js')>}
   */
  async replyAction(goToLast, forceRefresh) {
    if (app.session.user) {
      if (this.canReply()) {
        if (!app.composer.composingReplyTo(this) || forceRefresh) {
          await app.composer.load(() => import('../components/ReplyComposer'), {
            user: app.session.user,
            discussion: this,
          });
        }

        await app.composer.show();

        if (goToLast && app.viewingDiscussion(this) && !app.composer.isFullScreen()) {
          await app.current.get('stream').goToNumber('reply');
        }

        return Promise.resolve(app.composer);
      } else {
        return Promise.reject();
      }
    }

    await app.modal.show(() => import('../components/LogInModal'));

    return Promise.reject();
  },

  /**
   * Hide a discussion.
   *
   * @return {Promise<void>}
   */
  hideAction() {
    this.pushData({ attributes: { hiddenAt: new Date() }, relationships: { hiddenUser: app.session.user } });

    return this.save({ isHidden: true });
  },

  /**
   * Restore a discussion.
   *
   * @return {Promise<void>}
   */
  restoreAction() {
    this.pushData({ attributes: { hiddenAt: null }, relationships: { hiddenUser: null } });

    return this.save({ isHidden: false });
  },

  /**
   * Delete the discussion after confirming with the user.
   *
   * @return {Promise<void>}
   */
  deleteAction() {
    if (confirm(extractText(app.translator.trans('core.forum.discussion_controls.delete_confirmation')))) {
      // If we're currently viewing the discussion that was deleted, go back
      // to the previous page.
      if (app.viewingDiscussion(this)) {
        app.history.back();
      }

      return this.delete().then(() => app.discussions.removeDiscussion(this));
    }
  },

  /**
   * Rename the discussion.
   */
  renameAction() {
    return app.modal.show(RenameDiscussionModal, {
      currentTitle: this.title(),
      discussion: this,
    });
  },
};

export default DiscussionControls;
