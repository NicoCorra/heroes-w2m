import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroesService } from './heroes.service';
import { firstValueFrom } from 'rxjs';
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

const newHero: Heroe = {
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
    const mockResponse = heroesListMock

    const heroes$ = service.getHeroes();
    const heroesPromise = firstValueFrom(heroes$);

    const req = httpTesting.expectOne(`${ baseUrl }/heroes`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
    expect(await heroesPromise).toEqual(mockResponse)
  });

  it('should return the hero by id', async () => {
    const heroId = 'dc-batman';
    const expectedHero = heroesListMock.find(hero => hero.id === heroId);

    const hero$ = service.getHeroesById(heroId);
    const heroPromise = firstValueFrom(hero$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('GET');

    if (expectedHero) {
      req.flush(expectedHero);
    } else {
      req.flush(null, { status: 404, statusText: 'Not Found' });
    }

    const hero = await heroPromise;
    expect(hero).toEqual(expectedHero);
  });

  it('should add a hero successfully', async () => {
    service.addHeroe(newHero).subscribe(response => {
      expect(response).toEqual(addedHeroResponse);
    });

    const req = httpTesting.expectOne(`${baseUrl}/heroes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);

    req.flush(addedHeroResponse);
  });

  it('should return undefined if the API call fails', async () => {
    const heroeId = 'dc-batman';
    const errorResponse = { status: 404, statusText: 'No found' };

    const heroes$ = service.getHeroesById(heroeId);
    const heroPromise = firstValueFrom(heroes$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${heroeId}`);
    expect(req.request.method).toBe('GET');

    req.flush('No found', errorResponse);
    expect(await heroPromise).toBeUndefined();
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
      first_appearance: ''};

    const updatedHeroResponse: Heroe = { ...heroWithId };

    const heroes$ = service.updateHeroe(heroWithId);
    const heroPromise = firstValueFrom(heroes$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/dc-batman`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(heroWithId);

    req.flush(updatedHeroResponse);

    expect(await heroPromise).toEqual(updatedHeroResponse);
  });


  it('should handle error if update hero fails', async () => {
    const heroWithId: Heroe = { id: 'dc-batman',
      superhero: 'Batman',
      alter_ego: 'Rich',
      publisher: 'DCComics',
      first_appearance: ''};

    const errorResponse = { status: 500, statusText: 'Server Error' };

    const heroes$ = service.updateHeroe(heroWithId);
    const heroPromise = firstValueFrom(heroes$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/dc-batman`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(heroWithId);

    req.flush('Error', errorResponse);

    try {
      await heroPromise;
      fail('Expected error, but got a response');
    } catch (error: any) {
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Server Error');
    }
  });

  it('should delete a hero successfully', async () => {
    const heroId = 'dc-batman';

    const deleteHero = service.deleteHeroe(heroId);
    const deleteHeroPromise = firstValueFrom(deleteHero);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);

    expect(await deleteHeroPromise).toBe(true);
  });

  it('should handle error and return false if delete fails', async () => {
    const heroId = 'dc-batman';

    const deleteHero = service.deleteHeroe(heroId);
    const deleteHeroPromise = firstValueFrom(deleteHero);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('DELETE');

    const errorResponse = { status: 500, statusText: 'Server Error' };
    req.flush('Error', errorResponse);

    expect(await deleteHeroPromise).toBe(false);
  });
});
