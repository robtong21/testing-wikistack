const chai = require('chai')
const expect = chai.expect;
const spies = require('chai-spies')
const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/wikistack')
const Page = require('../models').Page
chai.use(spies)

describe('Page model', function() {

    let page;
    beforeEach('create page instance', () => {
      page = Page.build({
        title: "Wade's World!",
        content: "What up, bro?",
        status: 'open',
        tags: "wade, world, bro"
      })
    })

  describe('fields', function() {
    it('should have a title', function() {
      expect(page.title).to.exist
      expect(page.title).to.be.a('string')
    })
    it('should have a proper url title', function(done) {
      page.save()
      .then(page => {
        expect(page.urlTitle).to.exist
        expect(page.urlTitle).to.equal('Wades_World')
        done()
      })
      .catch(done)
    })
    it('should have content', (done) => {
      page.save()
      .then(page => {
        expect(page.content).to.exist
        expect(page.content).to.equal('What up, bro?')
        done()
      })
      .catch(done)
    })
    it('should be open status', (done) => {
      page.save()
      .then(page => {
        expect(page.status).to.equal('open')
        done()
      })
      .catch(done)
    })
    it('should have an array of tags if exists', (done) => {
      page.save()
      .then(page => {
        expect(page.tags).to.deep.equal(['wade', 'world', 'bro'])
        done()
      })
      .catch(done)
    })
  })

  describe('hooks', function() {
    it('should have "/wiki" prepended to url title', (done) => {
      page.save()
        .then(page => {
          expect(page.route).to.equal('/wiki/Wades_World');
          done()
        })
        .catch(done);
    })

    it('should find the right class tags', (done) => {
      page.save()
        .then(page => {
          let tag = page.tags[0];
          let findPages = Page.findByTag(tag);
          console.log('findpage', findPages);
          return Promise.all([findPages, page]);
        })
        .spread(function(foundPages, page) {
          let idArr = foundPages.map(page => page.id);
          let pageID = page.id;
          expect(idArr.indexOf(pageID)).to.be.above(-1);
          done();
        })
        .catch(done);
    })
    it('should not find pages without the tag', (done) => {

      let pageWithoutTag = Page.build({
        title: "Rob's World!",
        content: "What up, bro?",
        status: 'open',
        tags: "rob"
      })
      let tag = "wade";

      pageWithoutTag.save()
        .then(pageNoTag => {
          return Promise.all([page.save(), pageNoTag]);
        })
        .spread(function(origPage, pageNoTag){
          let findPages = Page.findByTag(tag);
          return Promise.all([findPages, pageNoTag]);
        })
        .spread(function(foundPages, pageNoTag) {
          let idArr = foundPages.map(page => page.id);
          let pageID = pageNoTag.id;
          expect(idArr.indexOf(pageID)).to.be.equal(-1);
          done();
        })
        .catch(done);
    });
  })
})
