/**
 * Validation helpers for NEXUS Library
 */

export function validateBook(bookData) {
  const errors = {};
  if (!bookData.title || !bookData.title.trim()) {
    errors.title = 'Title is required';
  }
  if (!bookData.author || !bookData.author.trim()) {
    errors.author = 'Author is required';
  }
  if (!bookData.quantity || parseInt(bookData.quantity, 10) < 1) {
    errors.quantity = 'Quantity must be at least 1';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateMember(memberData, existingMembers = []) {
  const errors = {};
  if (!memberData.name || !memberData.name.trim()) {
    errors.name = 'Member full name is required';
  }
  if (memberData.email && !/\S+@\S+\.\S+/.test(memberData.email)) {
    errors.email = 'Invalid email address format';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
