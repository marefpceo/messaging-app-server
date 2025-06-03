const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('Create Users for Development Database.');

  const userOne = await prisma.user.upsert({
    where: { email: 'userOne@test.com' },
    update: {},
    create: {
      firstname: 'User',
      lastname: 'One',
      username: 'userOne1',
      date_of_birth: new Date('1985-10-5'),
      email: 'userOne@test.com',
      password: 'kkkkkkkkkk',
      profile: {
        create: {
          bio: `The first user to be created! It's a pleasure`,
          settings: {
            create: {
              background: 'black',
              font: 'large',
              color: 'white',
            },
          },
        },
      },
    },
    include: {
      profile: {
        include: {
          settings: true,
        },
      },
    },
  });

  const userTwo = await prisma.user.upsert({
    where: { email: 'userTwo@test.com' },
    update: {},
    create: {
      firstname: 'User',
      lastname: 'Two',
      username: 'userTwo2',
      date_of_birth: new Date('1978-5-20'),
      email: 'userTwo@test.com',
      password: 'kkkkkkkkkk',
      profile: {
        create: {
          settings: {
            create: {},
          },
        },
      },
    },
    include: {
      profile: {
        include: {
          settings: true,
        },
      },
    },
  });

  const userThree = await prisma.user.upsert({
    where: { email: 'userThree@test.com' },
    update: {},
    create: {
      firstname: 'Mr',
      lastname: 'Three',
      username: 'userThree',
      date_of_birth: new Date('2000-2-3'),
      email: 'userThree@test.com',
      password: 'kkkkkkkkkk',
      profile: {
        create: {
          settings: {
            create: {},
          },
        },
      },
    },
    include: {
      profile: {
        include: {
          settings: true,
        },
      },
    },
  });

  const userFour = await prisma.user.upsert({
    where: { email: 'user@Four.com' },
    update: {},
    create: {
      firstname: 'UMan',
      lastname: 'Four',
      username: 'userFour',
      date_of_birth: new Date('1985-7-31'),
      email: 'user@Four.com',
      password: 'kkkkkkkkkk',
      profile: {
        create: {
          settings: {
            create: {},
          },
        },
      },
    },
    include: {
      profile: {
        include: {
          settings: true,
        },
      },
    },
  });

  const userFive = await prisma.user.upsert({
    where: { email: 'u5Five@me.com' },
    update: {},
    create: {
      firstname: 'Fifth',
      lastname: 'User',
      username: 'userFive',
      date_of_birth: new Date('1965-11-13'),
      email: 'u5Five@me.com',
      password: 'kkkkkkkkkk',
      profile: {
        create: {
          settings: {
            create: {},
          },
        },
      },
    },
    include: {
      profile: {
        include: {
          settings: true,
        },
      },
    },
  });

  console.log({ userOne, userTwo, userThree, userFour, userFive });
  console.log('Test users created');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
