import requests
from django.core.management.base import BaseCommand
from ...models import Game, Platform, Genre, Developer, Publisher
from datetime import datetime

API_KEY = "0b0a30fab6044bf4b67b8149ecda48a1"
BASE_URL = "https://api.rawg.io/api/games"

class Command(BaseCommand):
    help = "Import games from RAWG API (pages 1 à 10)"

    def handle(self, *args, **options):
        for page in range(1, 11):  # Pages 1 à 10 incluses
            url = f"{BASE_URL}?key={API_KEY}&page={page}"
            response = requests.get(url)

            if response.status_code != 200:
                self.stderr.write(self.style.ERROR(f"Erreur API à la page {page}"))
                continue

            data = response.json()
            games = data.get("results", [])

            for game_data in games:
                name = game_data["name"]
                release_date = game_data.get("released")
                image = game_data.get("background_image")

                if release_date:
                    try:
                        release_date = datetime.strptime(release_date, "%Y-%m-%d").date()
                    except ValueError:
                        release_date = None

                game_obj, created = Game.objects.get_or_create(
                    name=name,
                    defaults={
                        "release_date": release_date,
                        "background_image": image
                    }
                )

                if not created:
                    continue

                # Plateformes
                for p in game_data.get("parent_platforms", []):
                    platform_name = p["platform"]["name"]
                    platform_obj, _ = Platform.objects.get_or_create(name=platform_name)
                    game_obj.platforms.add(platform_obj)

                # Genres
                for g in game_data.get("genres", []):
                    genre_name = g["name"]
                    genre_obj, _ = Genre.objects.get_or_create(name=genre_name)
                    game_obj.genres.add(genre_obj)

                # Détails supplémentaires (développeurs / éditeurs)
                game_id = game_data["id"]
                detail_url = f"https://api.rawg.io/api/games/{game_id}?key={API_KEY}"
                detail_res = requests.get(detail_url)

                if detail_res.status_code == 200:
                    detail = detail_res.json()

                    for dev in detail.get("developers", []):
                        dev_name = dev["name"]
                        dev_obj, _ = Developer.objects.get_or_create(name=dev_name)
                        game_obj.developers.add(dev_obj)

                    for pub in detail.get("publishers", []):
                        pub_name = pub["name"]
                        pub_obj, _ = Publisher.objects.get_or_create(name=pub_name)
                        game_obj.publishers.add(pub_obj)

                self.stdout.write(self.style.SUCCESS(f"Importé : {name} (page {page})"))
