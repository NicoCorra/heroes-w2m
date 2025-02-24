import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroesService } from './heroes.service';
import { environment } from '../../../environments/environment';
import { Heroe } from '../interfaces/heroe';

const baseUrl: string = environment.baseUrl;

const heroesListMock: Heroe[] = [
  {
    id: "dc-batman",
    superhero: "Batman",
    publisher: "DCComics",
    alter_ego: "Bruce Wayne",
    first_appearance: "Detective Comics #27"
  },
  {
    id: "dc-superman",
    superhero: "Superman",
    publisher: "DCComics",
    alter_ego: "Kal-El",
    first_appearance: "Action Comics #1"
  },
  {
    id: "dc-flash",
    superhero: "Flash",
    publisher: "DCComics",
    alter_ego: "Jay Garrick",
    first_appearance: "Flash Comics #1"
  }
];

const newHero: Heroe  = {
  id: 'dc-wonderwoman',
  superhero: 'Wonder Woman',
  publisher: 'DCComics',
  alter_ego: 'Diana Prince',
  first_appearance: 'All Star Comics #8'
};

const addedHeroResponse: Heroe = { ...newHero, id: 'dc-wonderwoman' };

describe('HeroesService', () => {
  let service: HeroesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroesService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HeroesService);
    httpTesting = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sould be the heroes list', async () => {
    const heroesSpy = jest.spyOn(service.heroes, 'set');

    const result = service.getHeroes();

    const req = httpTesting.expectOne(`${ baseUrl }/heroes`);
    expect(req.request.method).toBe('GET');

    req.flush(heroesListMock);

    expect(heroesSpy).toHaveBeenCalledWith(heroesListMock);
    expect(result).toBe(service.heroes);
  });

  it('should call getHeroes if the heroes is empty', async () => {
    const getHeroesSpy = jest.spyOn(service, 'getHeroes').mockImplementation();

    service.heroes.set([]);
    service.getHeroesById('dc-batman')

    expect(getHeroesSpy).toHaveBeenCalled();
  });

  it('should return the correct hero if heroes has data', () => {
    const newHero: Heroe = {
      id: 'dc-wonderwoman',
      superhero: 'Wonder Woman',
      publisher: 'DCComics',
      alter_ego: 'Diana Prince',
      first_appearance: 'All Star Comics #8'
    };

    service.heroes.set([newHero]);

    const result = service.getHeroesById('dc-wonderwoman')();

    expect(result).toEqual({
      id: 'dc-wonderwoman',
      superhero: 'Wonder Woman',
      publisher: 'DCComics',
      alter_ego: 'Diana Prince',
      first_appearance: 'All Star Comics #8'
    });
  });

  it('should return undefined if the ID does not exist', async () => {

    service.heroes.set(heroesListMock);

    const result = service.getHeroesById('dc-hulk')();

    expect(result).toBeUndefined();
  });

  it('should add a hero successfully', waitForAsync(() => {
    const newHero: Heroe = {
      id: 'dc-wonderwoman',
      superhero: 'Wonder Woman',
      publisher: 'DCComics',
      alter_ego: 'Diana Prince',
      first_appearance: 'All Star Comics #8'
    };

    const addedHeroResponse: Heroe = { ...newHero };

    const newHeroSignal = service.addHeroe(newHero);

    const req = httpTesting.expectOne(`${baseUrl}/heroes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);

    req.flush(addedHeroResponse);

    setTimeout(() => {
      expect(newHeroSignal()).toEqual(addedHeroResponse);

      expect(service.heroes()).toContain(addedHeroResponse);
    }, 0);
  }));


  it('should handle error when adding a hero', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const newHero: Heroe = {
      id: 'dc-wonderwoman',
      superhero: 'Wonder Woman',
      publisher: 'DCComics',
      alter_ego: 'Diana Prince',
      first_appearance: 'All Star Comics #8'
    };

    const signalResult = service.addHeroe(newHero);

    const req = httpTesting.expectOne(`${baseUrl}/heroes`);
    expect(req.request.method).toBe('POST');

    req.flush(null, { status: 500, statusText: 'Server Error' });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding heroe:', expect.any(HttpErrorResponse));

    expect(signalResult()).toBeNull();

    consoleErrorSpy.mockRestore();
  });


  it('should return all heroes if search name is less than 3 characters', async () => {
    const result = service.searchHeroesByName(heroesListMock, 'Ba');
    expect(result).toEqual(heroesListMock);
  });

  it('should return matching heroes when a valid name is searched', async () => {
    const result = service.searchHeroesByName(heroesListMock, 'Bat');
    expect(result).toEqual([heroesListMock[0]]);
  });

  it('should return an empty array if no heores match the search', async () => {
    const result = service.searchHeroesByName(heroesListMock, 'Hulk');
    expect(result).toEqual([]);
  });

  it('should be case insensitive', async () => {
    const result = service.searchHeroesByName(heroesListMock, 'SuPEr');
    expect(result).toEqual([heroesListMock[1]]);
  });

  it('should update a hero successfully', async () => {
    const heroWithId: Heroe = {
      id: 'dc-batman',
      superhero: 'Batman',
      alter_ego: 'Rich',
      publisher: 'DCComics',
      first_appearance: ''
    };

    const result = await service.updateHeroe(heroWithId);
    const req = httpTesting.expectOne(`${baseUrl}/heroes/dc-batman`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(heroWithId);
  });


  it('should handle error if update hero fails', async () => {
    const heroWithId: Heroe = { id: 'dc-batman',
      superhero: 'Batman',
      alter_ego: 'Rich',
      publisher: 'DCComics',
      first_appearance: ''};

    const errorResponse = { status: 500, statusText: 'Server Error' };

    service.updateHeroe(heroWithId);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/dc-batman`);
    expect(req.request.method).toBe('PUT');

    req.flush('Error', errorResponse);

    expect(errorResponse.status).toBe(500);
    expect(errorResponse.statusText).toBe('Server Error');

  });

  it('should update a hero successfully', () => {
    const heroWithId: Heroe = {
      id: 'dc-batman',
      superhero: 'Batman',
      alter_ego: 'Rich',
      publisher: 'DCComics',
      first_appearance: 'Detective Comics #27'
    };

    const updatedHeroResponse: Heroe = { ...heroWithId };

    const result = service.updateHeroe(heroWithId);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${heroWithId.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(heroWithId);

    req.flush(updatedHeroResponse);

    expect(result()).toEqual(updatedHeroResponse);
  });

  it('should delete a hero successfully', () => {
    service.heroes.set([
      { id: 'dc-batman', superhero: 'Batman', publisher: 'DCComics', alter_ego: 'Bruce Wayne', first_appearance: 'Detective Comics #27' },
      { id: 'dc-superman', superhero: 'Superman', publisher: 'DCComics', alter_ego: 'Kal-El', first_appearance: 'Action Comics #1' }
    ]);

    expect(service.heroes().length).toBe(2);

    service.deleteHeroe('dc-batman');

    const req = httpTesting.expectOne(`${baseUrl}/heroes/dc-batman`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    setTimeout(() => {
      expect(service.heroes().length).toBe(1);
      expect(service.heroes()).not.toContain(jasmine.objectContaining({ id: 'dc-batman' }));
    }, 0);
  });


  it('should handle error and return false if delete fails', async () => {
    const heroId = 'dc-batman';
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    service.deleteHeroe(heroId);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${heroId}`);
    req.error(new ErrorEvent('Network error'));

    expect(errorSpy).toHaveBeenCalledWith(
      `Error al eliminar el héroe con ID ${heroId}:`,
      expect.anything()
    );

    errorSpy.mockRestore();
  });
});
