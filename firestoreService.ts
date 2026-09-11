import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { MonthlyData, PostData } from './types';
import { RAW_DATA, POSTS_DATA } from './data';

const MONTHLY_COLLECTION = 'monthly_metrics';
const POSTS_COLLECTION = 'social_posts';
const COMMENTS_COLLECTION = 'dashboard_comments';
const REPORT_EDITS_COLLECTION = 'report_edits';

/**
 * Clean data for Firestore by removing any undefined values
 */
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Fetch all monthly metrics from Firestore
 */
export async function fetchMonthlyMetricsFromFirestore(): Promise<MonthlyData[]> {
  try {
    const colRef = collection(db, MONTHLY_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];
    
    const results: MonthlyData[] = [];
    snapshot.forEach(docSnap => {
      results.push(docSnap.data() as MonthlyData);
    });
    
    return results.sort((a, b) => parseInt(`${a.year}${a.month}`) - parseInt(`${b.year}${b.month}`));
  } catch (error) {
    console.error('Error fetching monthly metrics from Firestore:', error);
    throw error;
  }
}

/**
 * Save or update a single month in Firestore
 */
export async function saveMonthToFirestore(month: MonthlyData): Promise<void> {
  try {
    const docRef = doc(db, MONTHLY_COLLECTION, month.id);
    const sanitized = sanitizeForFirestore({
      ...month,
      updatedAt: new Date().toISOString()
    });
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error(`Error saving month ${month.id} to Firestore:`, error);
    throw error;
  }
}

/**
 * Delete a month from Firestore
 */
export async function deleteMonthFromFirestore(monthId: string): Promise<void> {
  try {
    const docRef = doc(db, MONTHLY_COLLECTION, monthId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting month ${monthId} from Firestore:`, error);
    throw error;
  }
}

/**
 * Batch save multiple months to Firestore (for spreadsheet ingestion)
 */
export async function batchSaveMonthsToFirestore(months: MonthlyData[]): Promise<number> {
  try {
    const batch = writeBatch(db);
    months.forEach(m => {
      const docRef = doc(db, MONTHLY_COLLECTION, m.id);
      batch.set(docRef, sanitizeForFirestore({
        ...m,
        updatedAt: new Date().toISOString()
      }), { merge: true });
    });
    await batch.commit();
    return months.length;
  } catch (error) {
    console.error('Error batch saving months to Firestore:', error);
    throw error;
  }
}

/**
 * Fetch all posts from Firestore
 */
export async function fetchPostsFromFirestore(): Promise<PostData[]> {
  try {
    const colRef = collection(db, POSTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];
    
    const results: PostData[] = [];
    snapshot.forEach(docSnap => {
      results.push(docSnap.data() as PostData);
    });
    return results;
  } catch (error) {
    console.error('Error fetching posts from Firestore:', error);
    throw error;
  }
}

/**
 * Save or update a single post in Firestore
 */
export async function savePostToFirestore(post: PostData): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, post.id);
    await setDoc(docRef, sanitizeForFirestore({
      ...post,
      createdAt: new Date().toISOString()
    }), { merge: true });
  } catch (error) {
    console.error(`Error saving post ${post.id} to Firestore:`, error);
    throw error;
  }
}

/**
 * Delete a post from Firestore
 */
export async function deletePostFromFirestore(postId: string): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, postId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting post ${postId} from Firestore:`, error);
    throw error;
  }
}

/**
 * Batch save multiple posts to Firestore
 */
export async function batchSavePostsToFirestore(posts: PostData[]): Promise<number> {
  try {
    const batch = writeBatch(db);
    posts.forEach(p => {
      const docRef = doc(db, POSTS_COLLECTION, p.id);
      batch.set(docRef, sanitizeForFirestore({
        ...p,
        createdAt: new Date().toISOString()
      }), { merge: true });
    });
    await batch.commit();
    return posts.length;
  } catch (error) {
    console.error('Error batch saving posts to Firestore:', error);
    throw error;
  }
}

/**
 * Seed initial baseline data into Firestore if database is empty
 */
export async function seedInitialFirestoreData(): Promise<{ months: number; posts: number }> {
  try {
    const monthsSaved = await batchSaveMonthsToFirestore(RAW_DATA);
    const postsSaved = await batchSavePostsToFirestore(POSTS_DATA);
    return { months: monthsSaved, posts: postsSaved };
  } catch (error) {
    console.error('Error seeding initial Firestore data:', error);
    throw error;
  }
}

/**
 * Fetch and listen to live changes for comments
 */
export function subscribeToComments(onUpdate: (comments: Record<string, string>) => void) {
  const colRef = collection(db, COMMENTS_COLLECTION);
  return onSnapshot(colRef, snapshot => {
    const comments: Record<string, string> = {};
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.comment) comments[docSnap.id] = data.comment;
    });
    onUpdate(comments);
  });
}

export async function saveCommentToFirestore(sectionId: string, comment: string): Promise<void> {
  try {
    const docRef = doc(db, COMMENTS_COLLECTION, sectionId);
    await setDoc(docRef, { comment, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error('Error saving comment to Firestore:', error);
  }
}

/**
 * Fetch and listen to live changes for report edits
 */
export function subscribeToReportEdits(onUpdate: (edits: Record<string, string>) => void) {
  const colRef = collection(db, REPORT_EDITS_COLLECTION);
  return onSnapshot(colRef, snapshot => {
    const edits: Record<string, string> = {};
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.content) edits[docSnap.id] = data.content;
    });
    onUpdate(edits);
  });
}

export async function saveReportEditToFirestore(reportKey: string, content: string): Promise<void> {
  try {
    const docRef = doc(db, REPORT_EDITS_COLLECTION, reportKey);
    await setDoc(docRef, { content, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error('Error saving report edit to Firestore:', error);
  }
}
