require("dotenv").config();
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before seeding");
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`[seed] admin user ${email} already exists, skipping`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const totp = speakeasy.generateSecret({
    name: `DevPrince Portfolio (${email})`,
  });

  await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      totpSecret: totp.base32,
      totpEnabled: true,
    },
  });

  console.log("[seed] admin user created:", email);
  console.log("[seed] Add this to your authenticator app (Google Authenticator, Authy, etc):");
  console.log(`[seed]   Secret (base32): ${totp.base32}`);
  console.log(`[seed]   otpauth URL:     ${totp.otpauth_url}`);
}

// Placeholder content — swap for real projects (or manage them through the
// admin dashboard once Phase 4 builds that). One of each status so the
// folder-color-coding on the /projects grid has something to show.
const SAMPLE_PROJECTS = [
  {
    title: "DevPrince Portfolio",
    slug: "devprince-portfolio",
    summary: "This site — Next.js + Express + Postgres, styled like a terminal reading JSON.",
    description: "The portfolio you're looking at right now, built in the open.",
    techStack: ["Go", "Node.js", "Next.js", "PostgreSQL", "Docker"],
    repoUrl: "https://github.com/",
    status: "IN_PROGRESS",
    featured: true,
    order: 0,
    docs: [
      {
        name: "README.md",
        type: "FILE",
        order: 0,
        content:
          "# DevPrince Portfolio\n\nA terminal/JSON-themed portfolio with a real backend, 2FA-protected admin dashboard, and self-hosted analytics.\n",
      },
      {
        name: "docs",
        type: "FOLDER",
        order: 1,
        children: [
          {
            name: "architecture.md",
            type: "FILE",
            order: 0,
            content:
              "Next.js client + Express API + PostgreSQL, containerized with Docker, nginx reverse proxy in production.\n",
          },
        ],
      },
    ],
  },
  {
    title: "Sample Completed Project",
    slug: "sample-completed-project",
    summary: "Placeholder for a finished project — swap this with a real one.",
    description: "",
    techStack: ["Go"],
    status: "COMPLETE",
    order: 1,
    docs: [
      {
        name: "README.md",
        type: "FILE",
        order: 0,
        content: "# Sample Completed Project\n\nReplace this with a real project via the admin dashboard.\n",
      },
    ],
  },
  {
    title: "Sample Upcoming Project",
    slug: "sample-upcoming-project",
    summary: "Placeholder for something not started yet.",
    description: "",
    techStack: [],
    status: "NOT_STARTED",
    order: 2,
    docs: [],
  },
];

async function createDocs(projectId, docs, parentId = null) {
  for (const doc of docs) {
    const { children, ...data } = doc;
    const created = await prisma.projectDoc.create({
      data: { ...data, projectId, parentId },
    });
    if (children?.length) {
      await createDocs(projectId, children, created.id);
    }
  }
}

async function seedProjects() {
  for (const { docs, ...data } of SAMPLE_PROJECTS) {
    const project = await prisma.project.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });

    const docCount = await prisma.projectDoc.count({ where: { projectId: project.id } });
    if (docCount === 0 && docs?.length) {
      await createDocs(project.id, docs);
    }
  }
  console.log(`[seed] ${SAMPLE_PROJECTS.length} sample project(s) ready`);
}

// Placeholder — matches what the profile page showed before it started
// reading from the API; edit/replace via the admin dashboard's Skills screen.
const SAMPLE_SKILLS = [
  { name: "Go", category: "LANGUAGE", order: 0 },
  { name: "JavaScript", category: "LANGUAGE", order: 1 },
  { name: "TypeScript", category: "LANGUAGE", order: 2 },
  { name: "SQL", category: "LANGUAGE", order: 3 },
  { name: "Docker", category: "TOOL", order: 0 },
  { name: "PostgreSQL", category: "TOOL", order: 1 },
  { name: "Git", category: "TOOL", order: 2 },
  { name: "VS Code", category: "TOOL", order: 3 },
  { name: "Postman", category: "TOOL", order: 4 },
  { name: "Linux", category: "PLATFORM", order: 0 },
  { name: "Windows", category: "PLATFORM", order: 1 },
  { name: "macOS", category: "PLATFORM", order: 2 },
];

async function seedSkills() {
  const existing = await prisma.skill.count();
  if (existing > 0) {
    console.log("[seed] skills already exist, skipping");
    return;
  }
  await prisma.skill.createMany({ data: SAMPLE_SKILLS });
  console.log(`[seed] ${SAMPLE_SKILLS.length} sample skill(s) ready`);
}

async function main() {
  await seedAdmin();
  await seedProjects();
  await seedSkills();
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
