import mock from '@/@fake-db/mock'
/* eslint-disable global-require */
const data = {
  profileData: {
    header: {
      avatar: '/favicon.ico',
      username: 'Kitty Allanson',
      designation: 'UI/UX Designer',
      coverImg: '/favicon.ico',
    },
    userAbout: {
      about: 'Tart I love sugar plum I love oat cake. Sweet ⭐️ roll caramels I love jujubes. Topping cake wafer.',
      joined: 'November 15, 2015',
      lives: 'New York, USA',
      email: 'bucketful@fiendhead.org',
      website: 'www.pixinvent.com',
    },
    suggestedPages: [
      {
        avatar: '/favicon.ico',
        username: 'Peter Reed',
        subtitle: 'Company',
        favorite: false,
      },
      {
        avatar: '/favicon.ico',
        username: 'Harriett Adkins',
        subtitle: 'Company',
        favorite: false,
      },
      {
        avatar: '/favicon.ico',
        username: 'Juan Weaver',
        subtitle: 'Company',
        favorite: false,
      },
      {
        avatar: '/favicon.ico',
        username: 'Claudia Chandler',
        subtitle: 'Company',
        favorite: false,
      },
      {
        avatar: '/favicon.ico',
        username: 'Earl Briggs',
        subtitle: 'Company',
        favorite: true,
      },
      {
        avatar: '/favicon.ico',
        username: 'Jonathan Lyons',
        subtitle: 'Beauty Store',
        favorite: false,
      },
    ],
    twitterFeeds: [
      {
        imgUrl: '/favicon.ico',
        title: 'Gertrude Stevens',
        id: 'tiana59 ',
        tags: '#design #fasion',
        desc: 'I love cookie chupa chups sweet tart apple pie ⭐️ chocolate bar.',
        favorite: false,
      },
      {
        imgUrl: '/favicon.ico',
        title: 'Lura Jones',
        id: 'tiana59 ',
        tags: '#vuejs #code #coffeez',
        desc: 'Halvah I love powder jelly I love cheesecake cotton candy. 😍',
        favorite: true,
      },
      {
        imgUrl: '/favicon.ico',
        title: 'Norman Gross',
        id: 'tiana59 ',
        tags: '#sketch #uiux #figma',
        desc: 'Candy jelly beans powder brownie biscuit. Jelly marzipan oat cake cake.',
        favorite: false,
      },
    ],
    post: [
      {
        avatar: '/favicon.ico',
        username: 'Leeanna Alvord',
        postTime: '12 Dec 2018 at 1:16 AM',
        postText:
          'Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.',
        postImg: '/favicon.ico',
        likes: 1240,
        youLiked: true,
        comments: 1240,
        share: 1240,
        likedUsers: [
          { avatar: '/favicon.ico', username: 'Trine Lynes' },
          { avatar: '/favicon.ico', username: 'Lilian Nenes' },
          { avatar: '/favicon.ico', username: 'Alberto Glotzbach' },
          { avatar: '/favicon.ico', username: 'George Nordic' },
          { avatar: '/favicon.ico', username: 'Vinnie Mostowy' },
        ],
        likedCount: 140,
        detailedComments: [
          {
            avatar: '/favicon.ico',
            username: 'Kitty Allanson',
            comment: 'Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.',
            commentsLikes: 34,
            youLiked: false,
          },
          {
            avatar: '/favicon.ico',
            username: 'Jackey Potter',
            comment: 'Unlimited color🖌 options allows you to set your application color as per your branding 🤪.',
            commentsLikes: 61,
            youLiked: true,
          },
        ],
      },
      {
        avatar: '/favicon.ico',
        username: 'Rosa Walters',
        postTime: '11 Dec 2019 at 1:16 AM',
        postText:
          'Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.',
        postImg: '/favicon.ico',
        likes: 1240,
        youLiked: true,
        comments: 1240,
        share: 1240,
        likedUsers: [
          { avatar: '/favicon.ico', username: 'Trine Lynes' },
          { avatar: '/favicon.ico', username: 'Lilian Nenes' },
          { avatar: '/favicon.ico', username: 'Alberto Glotzbach' },
          { avatar: '/favicon.ico', username: 'George Nordic' },
          { avatar: '/favicon.ico', username: 'Vinnie Mostowy' },
        ],
        likedCount: 271,
        detailedComments: [
          {
            avatar: '/favicon.ico',
            username: 'Kitty Allanson',
            comment: 'Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.',
            commentsLikes: 34,
            youLiked: false,
          },
        ],
      },
      {
        avatar: '/favicon.ico',
        username: 'Charles Watson',
        postTime: '12 Dec 2019 at 1:16 AM',
        postText:
          'Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.',
        postVid: 'https://www.youtube.com/embed/6stlCkUDG_s',
        likes: 1240,
        youLiked: true,
        comments: 1240,
        share: 1240,
        likedUsers: [
          { avatar: '/favicon.ico', username: 'Trine Lynes' },
          { avatar: '/favicon.ico', username: 'Lilian Nenes' },
          { avatar: '/favicon.ico', username: 'Alberto Glotzbach' },
          { avatar: '/favicon.ico', username: 'George Nordic' },
          { avatar: '/favicon.ico', username: 'Vinnie Mostowy' },
        ],
        likedCount: 264,
        detailedComments: [
          {
            avatar: '/favicon.ico',
            username: 'Kitty Allanson',
            comment: 'Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.',
            commentsLikes: 34,
            youLiked: false,
          },
        ],
      },
    ],
    latestPhotos: [
      { img: '/favicon.ico' },
      { img: '/favicon.ico' },
      { img: '/favicon.ico' },
      { img: '/favicon.ico' },
      { img: '/favicon.ico' },
      { img: '/favicon.ico' },
      { img: '/favicon.ico' },
      { img: '/favicon.ico' },
      { img: '/favicon.ico' },
    ],
    suggestions: [
      {
        avatar: '/favicon.ico',
        name: 'Peter Reed',
        mutualFriend: '6 Mutual Friends',
      },
      {
        avatar: '/favicon.ico',
        name: 'Harriett Adkins',
        mutualFriend: '3 Mutual Friends',
      },
      {
        avatar: '/favicon.ico',
        name: 'Juan Weaver',
        mutualFriend: '1 Mutual Friends',
      },
      {
        avatar: '/favicon.ico',
        name: 'Claudia Chandler',
        mutualFriend: '16 Mutual Friends',
      },
      {
        avatar: '/favicon.ico',
        name: 'Earl Briggs',
        mutualFriend: '4 Mutual Friends',
      },
      {
        avatar: '/favicon.ico',
        name: 'Jonathan Lyons',
        mutualFriend: '25 Mutual Friends',
      },
    ],
    polls: [
      {
        name: 'RDJ',
        result: '82%',
        votedUser: [
          { img: '/favicon.ico', username: 'Tonia Seabold' },
          { img: '/favicon.ico', username: 'Carissa Dolle' },
          { img: '/favicon.ico', username: 'Kelle Herrick' },
          { img: '/favicon.ico', username: 'Len Bregantini' },
          { img: '/favicon.ico', username: 'John Doe' },
        ],
      },
      {
        name: 'Chris Hemswort',
        result: '67%',
        votedUser: [
          { img: '/favicon.ico', username: 'Tonia Seabold' },
          { img: '/favicon.ico', username: 'Carissa Dolle' },
          { img: '/favicon.ico', username: 'Jonathan Lyons' },
        ],
      },
    ],
  },
}
/* eslint-disable global-require */
mock.onGet('/profile/data').reply(() => [200, data.profileData])
