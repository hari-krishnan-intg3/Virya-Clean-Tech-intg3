import {
  LINKEDIN_POST_TEMPLATES,
  getLinkedInPostById,
  formatLinkedInPostForPublishing,
} from './linkedinTemplates.js';

function main() {
  const args = process.argv.slice(2);
  const postId = Number(args[0]) || 1;

  if (args.includes('--list')) {
    console.log(`\n==================================================================`);
    console.log(`Virya CleanTech: 100 LinkedIn Post Templates (${LINKEDIN_POST_TEMPLATES.length} loaded)`);
    console.log(`==================================================================\n`);
    for (const post of LINKEDIN_POST_TEMPLATES) {
      console.log(`[#${String(post.id).padStart(3, '0')}] [${post.pillar}]`);
      console.log(`       Audience: ${post.targetAudience}`);
      console.log(`       Title: ${post.title}\n`);
    }
    console.log(`To preview a post, run: npx tsx LinkedIn/previewPost.ts <1-100>`);
    return;
  }

  const post = getLinkedInPostById(postId);
  if (!post) {
    console.error(`Post #${postId} not found. Valid IDs: 1 to ${LINKEDIN_POST_TEMPLATES.length}`);
    process.exit(1);
  }

  console.log(`\n==================================================================`);
  console.log(`LINKEDIN POST #${post.id}: ${post.title}`);
  console.log(`Pillar: ${post.pillar} | Target: ${post.targetAudience}`);
  console.log(`Visual Brief: ${post.visualAssetBrief}`);
  console.log(`==================================================================\n`);
  console.log(formatLinkedInPostForPublishing(post));
  console.log(`\n==================================================================\n`);
}

main();
