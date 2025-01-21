import { syncPosts } from '../../scripts/sync-posts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify the secret token
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.SYNC_SECRET_TOKEN}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await syncPosts();
    res.status(200).json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Sync failed', error: error.message });
  }
} 