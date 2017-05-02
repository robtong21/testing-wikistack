const chai = require('chai')
const expect = chai.expect;
const spies = require('chai-spies')
const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/wikistack')
const Page = require('../models').Page
chai.use(spies)

describe('Page model', function() {
  describe('fields', function() {
    let page;
    beforeEach('create page instance', () => {
      page = Page.build({
        title: "Wade's World!",
        content: "What up, bro?",
        status: 'open',
        tags: "wade, world, bro"
      })
    })
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
    xit('should have "/wiki" prepended to url title')
    xit('should find the right class tags')
    xit('should not find pages without the tag')
  })
})
