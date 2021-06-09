import React, { useContext, useMemo, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {Button, Colors, GhostButton} from './styled';
import appContext from '../contexts/appContext';
import UserCartoonAvatar from './UserCartoonAvatar';
import { createNewComment, deleteComment, getArticleComments, reportComment } from '../services/commentService';
import { useToasts } from 'react-toast-notifications';
import useAsync from '../hooks/useAsync';
import ReportCommentModal from './modals/ReportCommentModal';
import DeleteCommentModal from './modals/DeleteCommentModal';

const Comment = ({comment, onDelete, onReport}) => {
    const {user} = useContext(appContext);

    const handleReport = () => {
        onReport(comment.id);
    }

    const handleDelete = () => {
        onDelete(comment.id);
    }

    return (
        <CommentWrapper marked={!!comment.deleted_at || !!comment.reported}>
            <CommentHeader>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <UserCartoonAvatar size={20} userId={comment.userId} />
                    <span>{comment.userData.name}</span>
                </div>

                <RightInfo>
                    {!comment.deleted_at && !comment.reported && (
                        <>
                            {user && user.uid === comment.userId && <GhostButton onClick={handleDelete}>Delete</GhostButton>}
                            <GhostButton onClick={handleReport}>Report</GhostButton>
                        </>
                    )}

                    <TimeAgo>
                        {moment(comment.created_at._seconds * 1000).fromNow()}
                    </TimeAgo>
                </RightInfo>
            </CommentHeader>

            <CommentBody>
                {comment.text}
            </CommentBody>
        </CommentWrapper>
    )
}

const ArticleComments = ({article}) => {
    const {user, userProfile, userProfileIsComplete, setModal} = useContext(appContext);
    const {addToast} = useToasts();
    const [comment, setComment] = useState('');
    const [isCreatingNewComment, setIsCreatingNewComment] = useState(false);
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const {data: comments, loading, error, reload: reloadComments} = useAsync(
        () => getArticleComments(article.id),
        (res) => res.comments
    );

    const handleSubmitComment = () => {
        setIsCreatingNewComment(true);
        createNewComment({
            userId: user.uid,
            articleId: article.id,
            text: comment,
            userData: {
                    name: userProfile.name
            },
            articleData: {
                title: article.title
            }
        })
        .then(() => {
            setComment(''); // Clear the new comment text area
            addToast('Comment created', {appearance: 'success'});
            reloadComments();
        })
        .catch(() => {
            addToast('Error saving comment', {appearance: 'error'});
        })
        .finally(() => {
            setIsCreatingNewComment(false);
        });
    }

    const handleDelete = (commentId) => {
        deleteComment(commentId)
            .then(() => {
                reloadComments();
                addToast('Comment deleted', {appearance: 'success'});
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setModal(null));
    }

    const handleReport = (commentId) => {
        reportComment(commentId)
            .then(() => {
                reloadComments();
                addToast('Comment reported', {appearance: 'success'})
            })
            .catch(() => {
                addToast('Error reporting comment', {appearance: 'error'});
            })
            .finally(() => setModal(null));
    }

    const clickReportButton = (commentId) => {
        setModal(
            <ReportCommentModal
                onClose={() => setModal(null)}
                onReport={() => handleReport(commentId)}
            />
        );
    }

    const clickDeleteButton = (commentId) => {
        setModal(
            <DeleteCommentModal
                onClose={() => setModal(null)}
                onDelete={() => handleDelete(commentId)}
            />
        );
    }

    const commentsToDisplay = useMemo(() => {
        if (!comments || !comments.length) return [];

        return comments.sort((a, b) => {
            return a.created_at.seconds - b.created_at.seconds;
        })
    }, [comments]);

    const renderComments = () => {
        if (loading) return 'Loading...'

        if (!commentsToDisplay.length) return 'No comments for this article yet. Start the discussion!'

        return commentsToDisplay.map(comment => (
            <Comment key={comment.id} comment={comment} onDelete={clickDeleteButton} onReport={clickReportButton} />
        ));
    }

    return (
        <div>
            <NewCommentWrapper>
                {!userProfileIsComplete && (
                    <WarningMessage>
                        You must <a href="/settings">complete your profile</a> before you can add comments.
                    </WarningMessage>
                )}
                <textarea
                    onChange={handleCommentChange}
                    value={comment}
                    rows={4}
                    disabled={!userProfileIsComplete}
                    placeholder='Discuss the article, just be respectful to others. Using Spanish is encouraged.'
                />

                <ButtonRow>
                    <Button onClick={handleSubmitComment} disabled={!comment || isCreatingNewComment}>Submit</Button>
                </ButtonRow>
            </NewCommentWrapper>

            <CommentsList>
                {renderComments()}
            </CommentsList>

        </div>
    );
};

export default ArticleComments;

const NewCommentWrapper = styled.div`
    textarea {
        width: 100%;
        padding: 10px;
        background-color: #eee;
        border: 1px solid #ddd;
        outline: 0;
        border-radius: 8px;
        font-size: 16px;
        line-height: 24px;

        &:focused {
            border-color: ${Colors.Primary};
        }
    }
`;

const ButtonRow = styled.div`
    margin-top: 10px;
`;

const CommentsList = styled.div`
    margin-top: 30px;
`;
const CommentWrapper = styled.div`
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 30px;
    margin-bottom: 15px;
    z-index: -10;

    ${props => props.marked ? `
        opacity: 0.3; 
    `: ``}
`;
const CommentBody = styled.p`
    white-space: pre-wrap;
    line-height: 24px;
    margin-bottom: 0;
`;
const CommentHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    justify-content: space-between;
    
    span {
        margin-left: 5px;
    }
`;

const RightInfo = styled.div`
    display: flex;
`;

const TimeAgo = styled.div`
    font-size: 14px;
    color: ${Colors.MediumGrey};
`;

const WarningMessage = styled.div`
    color: red;
    margin-bottom: 10px;
    font-weight: 300;
    font-family: 'Source Sans Pro', sans-serif;

    a {
        color: red;
        text-decoration: underline;
    }
`;
