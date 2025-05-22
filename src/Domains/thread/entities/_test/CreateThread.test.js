const CreateThread = require('../CreateThread');


describe('CreateThread', () => {
  it('should throw error when payload did not contain needed property', () => {

    // arrange

    const payload = {
      title: 'A dicoding thread'
    };




    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');


  });


  it('should throw error when payload did not meet data spesification', () => {
    const payload = {
      title: 123,
      body: 'test'
    };

    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });



  it('should create object CreateThread correctly', () => {
    const payload = {
      title: 'A dicoding thread',
      body: 'this is a dicoding thread part'
    };

    const { title, body } = new CreateThread(payload);


    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });

});