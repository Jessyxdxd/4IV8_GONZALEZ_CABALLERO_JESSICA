import java.util.Scanner;
public class Nuevas_Tecnologias{
    public static void main(String[] args){
        Scanner sc= new Scanner(System.in);

        OUTER:
        while (true) { 
            System.out.println("Seleccione una opción");
            System.out.println("1. Toma de datos personales");
            System.out.println("2. Calcular volumen de dos figuras");
            System.out.println("3. Salir");
        int opcion = sc.nextInt();
        sc.nextLine();
        switch (opcion){

                case 1:  System.out.println("Ingrese sus datos"); 

                    System.out.println("Ingresa tu/s nombre/s");
                    String nombre = sc.nextLine();

                    System.out.println("Ingresa tu apellido paterno");
                    String apellido = sc.nextLine();

                    System.out.println("Ingresa tu apellido materno");
                    String apellidoM = sc.nextLine();

                    System.out.println("Ingresa tu edad");
                    int edad = sc.nextInt();
                break;
                case 2:  System.out.println("Programa para calcular volumen de dos figuras");
                
                break;
                case 3: System.out.println("Salir");

                break OUTER;
                default: System.out.println("Opción inválida");

                break;
        }
}



    }
}