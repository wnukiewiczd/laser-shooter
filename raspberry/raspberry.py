import random
import paho.mqtt.client as mqtt

# Zmienna globalna przechowująca wylosowany Wemos
selected_wemos = None

# Zmienna globalna przechowująca wynik gracza
playerScore = 0

# Funkcja obsługi wiadomości
def on_message(client, userdata, message):
    global playerScore
    global selected_wemos

    # Wemos1 został trafiony
    if message.topic == "wemos1/lightRead" and message.payload.decode() == "hit" and selected_wemos == "Wemos1":
        print("Cel 1 trafiony")
        playerScore += 1
        start(client)

    # Wemos2 został trafiony
    elif message.topic == "wemos2/lightRead" and message.payload.decode() == "hit" and selected_wemos == "Wemos2":
        print("Cel 2 trafiony")
        playerScore += 1
        start(client)

    # Wemos3 został trafiony
    elif message.topic == "wemos3/lightRead" and message.payload.decode() == "hit" and selected_wemos == "Wemos3":
        print("Cel 3 trafiony")
        playerScore += 1
        start(client)

# Funkcja start losująca Wemosa i wysyłająca wiadomość
def start(client):
    global selected_wemos

    # Losowanie Wemosa
    selected_wemos = random.choice(["Wemos1", "Wemos2", "Wemos3"])

    # Ustawienie odpowiedniego tematu
    topic = f"raspberry/{selected_wemos}/ledStrip"

    # Wysłanie wiadomości "turnOnGreen"
    client.publish(topic, "turnOnGreen")
    print(f"Wysłano wiadomość 'turnOnGreen' do {selected_wemos} na temat {topic}")

# Funkcja stop resetująca grę
def stop(client):
    global selected_wemos
    global playerScore

    client.publish("raspberry/WemosAll/ledStrip", "stop")
    print("Wysłano wiadomość 'stop' do wszystkich Wemosów")
    selected_wemos = None
    playerScore = 0

# Konfiguracja klienta MQTT
client = mqtt.Client()
client.on_message = on_message
client.connect("192.168.4.2", 1883, 60)

# Subskrypcje tematów dla Wemosów
client.subscribe("wemos1/lightRead")
client.subscribe("wemos2/lightRead")
client.subscribe("wemos3/lightRead")

# Start pętli odbierania wiadomości
client.loop_start()

try:
    # Wywołanie funkcji start
    start(client)
    while True:
        pass  # Program działa ciągle
except KeyboardInterrupt:
    client.loop_stop()
