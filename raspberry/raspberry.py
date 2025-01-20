import random
import paho.mqtt.client as mqtt

# Zmienna globalna przechowująca ostatnio użyty Wemos
last_wemos = None
# Zmienna globalna przechowująca wylosowany Wemos
selected_wemos = None
# Zmienna globalna przechowująca wynik gracza
playerScore = 0

# Funkcja obsługi wiadomości
def on_message(client, userdata, message):
    global playerScore
    global selected_wemos
    global last_wemos

    # Wemos1 został trafiony
    if message.topic == "wemos1/lightRead" and message.payload.decode() == "hit" and selected_wemos == "Wemos1":
        client.publish("raspberry/application/targetHit", "Wemos1")
        print("Cel 1 trafiony")
        playerScore += 1
        start(client)
    # Wemos2 został trafiony
    elif message.topic == "wemos2/lightRead" and message.payload.decode() == "hit" and selected_wemos == "Wemos2":
        client.publish("raspberry/application/targetHit", "Wemos2")
        print("Cel 2 trafiony")
        playerScore += 1
        start(client)
    # Wemos3 został trafiony
    elif message.topic == "wemos3/lightRead" and message.payload.decode() == "hit" and selected_wemos == "Wemos3":
        client.publish("raspberry/application/targetHit", "Wemos3")
        print("Cel 3 trafiony")
        playerScore += 1
        start(client)
    elif message.topic == "application/raspberry/gameStart":
        playerScore = 0
        selected_wemos = None
        last_wemos = None  # Reset ostatnio użytego Wemosa
        start(client)
    elif message.topic == "application/raspberry/gameEnd":
        client.publish("raspberry/application/playerScore", f"{playerScore}")
        client.publish("raspberry/Wemos1/robot", "robotStop")
        client.publish("raspberry/WemosAll", "turnOnRainbow")
        stop(client)
    elif message.topic == "application/raspberry/gameEndForce":
        client.publish("raspberry/Wemos1/robot", "robotStop")
        stop(client)
    elif message.topic == "application/raspberry/runDrivingRobot":
        client.publish("raspberry/Wemos1/robot", "robotRun")

# Funkcja start losująca Wemosa i wysyłająca wiadomość
def start(client):
    global selected_wemos
    global last_wemos

    # Lista wszystkich Wemosów
    all_wemos = ["Wemos1", "Wemos2", "Wemos3"]

    # Filtrujemy Wemosy, które mogą być wylosowane (wszystkie poza ostatnio użytym)
    available_wemos = [wemos for wemos in all_wemos if wemos != last_wemos]

    # Losowanie Wemosa
    selected_wemos = random.choice(available_wemos)

    # Aktualizacja ostatnio użytego Wemosa
    last_wemos = selected_wemos

    # Ustawienie odpowiedniego tematu
    topic = f"raspberry/{selected_wemos}/ledStrip"
    # Wysłanie wiadomości "turnOnGreen"
    client.publish(topic, "turnOnGreen")
    print(f"Wysłano wiadomość 'turnOnGreen' do {selected_wemos} na temat {topic}")

# Funkcja stop resetująca grę
def stop(client):
    global selected_wemos
    global playerScore
    global last_wemos

    client.publish("raspberry/WemosAll", "stop")
    print("Wysłano wiadomość 'stop' do wszystkich Wemosów")
    selected_wemos = None
    playerScore = 0
    last_wemos = None  # Reset ostatnio użytego Wemosa

# Konfiguracja klienta MQTT
client = mqtt.Client()
client.on_message = on_message
client.connect("192.168.4.2", 1883, 60)

# Subskrypcje tematów dla Wemosów
client.subscribe("wemos1/lightRead")
client.subscribe("wemos2/lightRead")
client.subscribe("wemos3/lightRead")
client.subscribe("application/raspberry/gameStart")
client.subscribe("application/raspberry/gameEnd")
client.subscribe("application/raspberry/runDrivingRobot")
client.subscribe("application/raspberry/gameEndForce")

# Start pętli odbierania wiadomości
client.loop_start()

try:
    # Wywołanie funkcji start
    stop(client)
    while True:
        pass  # Program działa ciągle
except KeyboardInterrupt:
    client.loop_stop()