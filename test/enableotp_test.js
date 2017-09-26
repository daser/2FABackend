var should = require("chai").should(),
	expect = require("chai").expect,
	supertest = require("supertest"),
	api = supertest('http://localhost:3000/otpapi'),
	assert = require("assert"),
	_ = require("lodash");


// before(function(done){

describe('Testing Module', function() {
	this.timeout(15000);

var otp; 

it('should enableOtp', function(done){
	this.timeout(15000);
    setTimeout(done, 15000);
	api.post('/enableOtp')
	.set('content-type','application/json')
	.send({
		uid:"1749b4ddd2781d08c09890f0"
	})
	.expect('Content-Type',/json/)
	.expect(200)
	.end(function(err, res){
		assert(_.has(res.body, 'userid'));
		assert(_.has(res.body, 'otpkey'));
		assert(_.has(res.body, 'otpauth_url'));
		return done();
	});
});




it('should getTotp', function(done){
	this.timeout(15000);
    setTimeout(done, 15000);
	api.post('/getTotp')
	.set('content-type','application/json')
	.send({
		uid:"1749b4ddd2781d08c09890f0"
	})
	.expect('Content-Type',/json/)
	.expect(200)
	.end(function(err, res){
		otp = res.body;
		expect(res.body).to.have.lengthOf(6);
		return done();
	});
});




it('should getTotp', function(done){
	this.timeout(15000);
    setTimeout(done, 15000);
	api.post('/verifyOtp')
	.set('content-type','application/json')
	.send({
		uid:"1749b4ddd2781d08c09890f0",
		token: otp
	})
	.expect('Content-Type',/json/)
	.expect(200)
	.end(function(err, res){
		expect(res.body).to.be.true;
		return done();
	});
});


it('should disableTotp', function(done){
	this.timeout(15000);
    setTimeout(done, 15000);
	api.delete('/disableTotp')
	.set('content-type','application/json')
	.send({
		uid:"1749b4ddd2781d08c09890f0"
	})
	.expect('Content-Type',/json/)
	.expect(200)
	.end(function(err, res){
		assert(_.has(res.body, 'ok'));
		assert(_.has(res.body, 'opTime'));
		assert(_.has(res.body, 'electionId'));
		assert(_.has(res.body, 'n'));
		return done();
	});
});





});//end of describe
