export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const databaseUrl = process.env.DATABASE_URL || 'postgres:localhost/levelplayingfield';

export const analytics = {
  facebook: '213210406090263',
  google: {
    trackingId: 'UA-86860505-1',
  },
};
