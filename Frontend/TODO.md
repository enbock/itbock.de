Nächste Ideen:

* Login per Token (MFA)
    * Login über 6-stelligen code
    * Abgespeicherte Person enthält ein UUID-4 als Person-ID
    * Daten der Person enthält eine Liste von zugewiesenen Rollen
* Autorisation:
    * Es gibt globale Rollen mit einer UUID4 als Rollen-ID und einen Namen
* Replication-Layer
    * Backend speichert View Models, die von Backend-Apps zusammen mit einem Message-Eintrag abgelegt werden
    * Backend-Apps enthalten business logic und erhalten Daten vom Replication-Layer
    * Frontend prüft Message-Queues des Replication-Layers um Daten abzuholen
    * Frontend hinterlegt in Message-Queue und startet Backend-Logic-Tick, welcher die Queue asynchron abarbeitet
    * Replication Layer enthalten Authorization:
        * Zugriffsrolle (Rollen-ID) oder Zugriffsperson (Person-ID)
    * Es sind mehrere Replication-Layer möglich
