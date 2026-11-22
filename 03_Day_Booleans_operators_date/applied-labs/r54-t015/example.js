export function canEdit(user, post) {
  const isOwner = user.id === post.ownerId;
  const isAdmin = user.role === 'admin';
  return user.authenticated === true && (isOwner || isAdmin);
}
