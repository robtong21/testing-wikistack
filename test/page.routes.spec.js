var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/wikistack')
const Page = require('../models').Page
const User = require('../models').User

describe('Routing', function(){

  before('clear db', (done) => {
    User.sync({force: true})
    .then(function () {
        return Page.sync({force: true});
      })
    .then(function() {
      done();
    });
  });

  let page;

  beforeEach('build page', () => {
      page = Page.build({
        title: "Wade's World!",
        content: "What up, bro?",
        status: 'open',
        tags: "wade, world, bro"
      })
  });

  describe('wiki routes', () => {
    describe('home routes', () => {
      xit('lists all pages on wiki home route', () => {

      });
      it('returns status 200', (done) => {
        agent
          .get('/wiki')
          .expect(200, done);
      });
    });

    describe('add page', () => {
      xit('adds pages', () => {

      });

      it('returns status 302', (done) => {
        agent
          .post('/wiki')
          .send({
            authorEmail: 'rob@rob.com',
            authorName: 'Rob',
            title: "Rob's Page",
            content: "Rob's content",
            status: "open",
            tags: "rob, wiki"
          })
          .expect(302, done)

      });

      it('shows the added page directly after it\'s added', (done) => {
        agent
          .post('/wiki')
          .send({
            authorEmail: 'rob@rob.com',
            authorName: 'Rob',
            title: "Rob's Page",
            content: "Rob's content",
            status: "open",
            tags: "rob, wiki"
          })
          .expect('Location', /wiki\/Robs_Page/, done);
      });
    });

    describe('related tag page', () => {
      xit('shows related pages by tag', () => {

      });
      it('returns status 200', (done) => {
        agent
          .get('/wiki/search/wade')
          .expect(200, done);
      });
    });

    describe('single page', () => {
      xit('gets the page information for a single page', () => {

      });
      it('returns status 200', (done) => {
        page.save()
          .then(() => {
            agent
              .get('/wiki/Wades_World')
              .expect(200, done);
          })
          .catch(done)
      });
    });




    describe('similar pages', () => {
      xit('finds similar pages to a single page', () => {

      });
      it('returns status 200', (done) => {
        page.save()
          .then(() => {
            agent
              .get('/wiki/Wades_World/similar')
              .expect(200, done);
          })
          .catch(done)

      });
    });


  });

  describe('user routes', () => {
    describe('single page', () => {

      xit('lists all users on user home route', () => {

      });

      it('returns status 200', (done) => {
        agent
        .get('/users/')
        .expect(200, done);
      });

    });

    describe('single page', () => {
      xit('displays all posts by a single user', () => {

      });

      it('returns status 200', (done) => {
        let newUser = User.findOrCreate({
          where: {
          name: "Rob",
          email: "rob@rob.com"
        }})
        .spread((user, bool) => {
          agent
          .get('/users/'+user.id)
          .expect(200, done);
        })
        .catch(done);
      });
    });
  });

  describe('error pages', () => {

    it('returns status 404 for single user page', (done) => {
      agent
      .get('/users/100')
      .expect(404, done);

    });

    it('returns status 404 for single wiki page', (done) => {
      agent
      .get('/wiki/fdsafsa')
      .expect(404, done);

    });

  });


})
