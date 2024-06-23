package com.mea_viewer_backend.figure_management;

import com.jooq.generated.tables.Draw2dImage;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FigureManagementApplication {
	@Autowired DSLContext dslContext;

	public static void main(String[] args) {
		SpringApplication.run(FigureManagementApplication.class, args);


	}

}
