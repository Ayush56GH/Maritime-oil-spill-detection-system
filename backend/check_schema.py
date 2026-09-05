import stream

def check():
    with stream.get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
            tables = [row[0] for row in cur.fetchall()]
            print("Existing Public Tables:", tables)
            
            if "ais_positions" in tables:
                cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ais_positions';")
                print("ais_positions columns:")
                for col in cur.fetchall():
                    print(f" - {col[0]} ({col[1]})")
                
                cur.execute("SELECT COUNT(*) FROM ais_positions;")
                count = cur.fetchone()[0]
                print(f"Total rows currently in ais_positions: {count}")

if __name__ == "__main__":
    check()
